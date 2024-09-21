import { createContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const getFriends = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/users/friends/" + currentUser.id
      );
      if (res.status === 200) {
        return res.data;
      } else {
        return [];
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return [];
      } else {
        throw error;
      }
    }
  };

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      { withCredentials: true }
    );
    setCurrentUser(res.data);
    return res.status;
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, login, getFriends }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const checkImageURL = (url) => {
  if (!url) return false;
  else {
    const pattern = new RegExp(".(png|jpg|jpeg|bmp|gif|webp)$", "i");
    return pattern.test(url);
  }
};

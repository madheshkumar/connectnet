import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ActivitiesContext = createContext();

// Activities component
export const ActivitiesContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [Activities, setActivities] = useState([]);

  // useEffect(() => {
  //   const fetchActivities = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8800/api/activities/${currentUser.id}`
  //       );
  //       setActivities(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchActivities();
  // }, [currentUser.id]);

  const logActivity = async (activity) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/activities/",
        activity
      );
      setActivities([...Activities, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/activities/${id}`);
      setActivities(Activities.filter((activity) => activity.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ActivitiesContext.Provider
      value={{ Activities, setActivities, logActivity, deleteActivity }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";

const Login = () => {
  const { login } = useContext(AuthContext);
  const cookie = Cookies.get("accessToken");

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await login(inputs);
      setErr(null);
      if (response === 200) {
        window.location.replace("/");
      } else {
        console.error("Login failed");
      }
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="left">
          <h1>Social App</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.{" "}
          </p>
          <span>Not Registered yet?</span>
          <Link to="/register">
            <button className="goto">Sign up</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              name="username"
              placeholder="User name"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <span>{err}</span>
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

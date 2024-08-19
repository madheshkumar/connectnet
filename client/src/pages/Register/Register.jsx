import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);

  const handleChange = (event) => {
    setInputs(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8800/api/auth/register",inputs);
      setErr(null)
      if (response.status === 200) {
        window.location.replace("/login");
      } else {
        console.error("Registration failed");
      }
    } catch (err) {
      setErr(err.response.data);
    }
  };


  return (
    <div className="register">
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
          <span>Do you have account already?</span>
          <Link to="/login">
            <button className="goto">Sign in</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="User name"
            />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Name"
            />
            <span>{err}</span>
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

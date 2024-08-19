import React, { useContext, useState } from "react";
import "./navbar.scss";

import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { checkImageURL, AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8800/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.replace("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="nav">
      <span className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          ConnectNET
        </Link>
      </span>
      <div className="navbar">
        <div className="searchbar">
          <SearchIcon className="svgicon" />
          <input type="text" name="search" placeholder="search" />
        </div>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <HomeIcon className="svgicon" />
        </Link>
        <AccountBoxIcon className="svgicon" />
        <NotificationsIcon className="svgicon" />
        <Link
          to={`/profile/${currentUser.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="user">
            <div className="userImg">
              {checkImageURL(currentUser.profilepic) ? (
                <img
                  src={".././profileimages/" + currentUser.profilepic}
                  alt="img"
                />
              ) : (
                <PersonIcon id="defaultprofile" />
              )}
            </div>
            <span>{currentUser.name}</span>
          </div>
        </Link>
        <div className="logout">
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

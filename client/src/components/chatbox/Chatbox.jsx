import React, { useState, useEffect, useContext } from "react";
import "./chatbox.scss";

import Chat from "../chat/Chat";
import Message from "../message/Message";

import PersonIcon from "@mui/icons-material/Person";
import { AuthContext, checkImageURL } from "../../context/AuthContext";

export const Chatbox = ({ user, setuser }) => {
  const { currentUser } = useContext(AuthContext);

  const handleUser = () => {
    setuser(null);
  };

  console.log(user.id, currentUser.id);
  return (
    <div className="chatbox_div">
      <div className="chatbox_header">
        <div className="chatbox_userinfo">
          <div className="userImg">
            {checkImageURL(user.profilepic) ? (
              <img src={".././profileimages/" + user.profilepic} alt="img" />
            ) : (
              <PersonIcon id="defaultprofile" />
            )}
          </div>
          <span>{user.name}</span>
        </div>
        <div className="chatbox_buttons">
          <button onClick={handleUser}>Close</button>
        </div>
      </div>
      <div className="chatbox_body">
        <div className="chatbox_message">
          <Chat sender={currentUser.id} receiver={user.id} />
        </div>
      </div>
      <div className="chatbox_footer">
        <Message sender={currentUser.id} receiver={user.id} />
      </div>
    </div>
  );
};

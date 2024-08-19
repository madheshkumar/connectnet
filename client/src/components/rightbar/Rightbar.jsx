import React, { useState, useEffect, useContext } from "react";
import "./rightbar.scss";

import PersonIcon from "@mui/icons-material/Person";
import { Chatbox } from "../chatbox/Chatbox";

import { AuthContext, checkImageURL } from "../../context/AuthContext";
import { ActivitiesContext } from "../../context/ActivitiesContext";
import { makeRequest } from "../../axios";
import { socket } from "../../App";

const Rightbar = () => {
  const { currentUser, getFriends } = useContext(AuthContext);
  const { Activities, setActivities } = useContext(ActivitiesContext);

  const [isUser, setUser] = useState(null);
  const [newUsers, setNewUsers] = useState([]);
  const [Friends, setFriends] = useState([]);


  const handleAddFunction = (e) => {
    const receiverId = parseInt(e.target.closest(".user").dataset.id);
    socket.emit("addFriend", { receiverId, senderId: currentUser.id });
    setNewUsers(newUsers.filter((user) => user.id !== receiverId));
    setActivities([...Activities, { activity: "Friend request sent", userId: currentUser.id, friendId: receiverId }]);
  };

  const handleRemoveFunction = (e) => {
    const receiverId = e.target.closest(".user").dataset.id;
    setNewUsers(newUsers.filter((user) => user.id !== receiverId));
  };

  const fetchFriends = async () => {
    try {
      const res = await getFriends();
      if (res.status === 200) setFriends(res);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    const res = await makeRequest.get("/users");
    return res.data;
  };

  useEffect(() => {
    fetchFriends();
    suggestFriends();
  }, [currentUser]);



  // console.log(isUser, Friends);

  const handleClick = (e) => {
    const userId = e.target.closest(".user").dataset.id;
    makeRequest.get("/users/find/" + userId).then((res) => {
      setUser(res.data);
    });
  };

  const suggestFriends = async () => {
    const users = await fetchUsers();
    const newUsers = users.filter(
      (user) =>
        user.id !== currentUser.id &&
        user.id !== Friends.map((friend) => friend.id)
    );
    setNewUsers(newUsers);
  };

  useEffect(() => {
    suggestFriends();
  }, [Friends]);

  useEffect(() => {
    socket.on("receiveFriendRequest", ({ senderId }) => {
      setActivities([...Activities, { activity: "Friend request received", userId: currentUser.id, friendId: senderId }]);
    });
  }, [currentUser.id,Activities]);

  useEffect(() => {
    console.log("Activities updated:", Activities);
  }, [Activities]);

  return (
    <div className="rightbar">
      <div className="container">
        <div className="item">
          <span>Suggestions for you</span>
          <div className="suggestContainer">
            {newUsers.map((user) => (
              <div key={user.id} data-id={user.id} className="user">
                <div className="userinfo">
                  <div className="userImg">
                    {checkImageURL(user.profilepic) ? (
                      <img
                        src={".././profileimages/" + user.profilepic}
                        alt="img"
                      />
                    ) : (
                      <PersonIcon id="defaultprofile" />
                    )}
                  </div>
                  <span>{user.name}</span>
                </div>
                <div className="buttons">
                  <button onClick={handleAddFunction}>add</button>
                  <button onClick={handleRemoveFunction}>remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userinfo">
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
              <p>
                <span>Name</span> changed their profile picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userinfo">
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
              <p>
                <span>Name</span> changed their profile picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userinfo">
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
              <p>
                <span>Name</span> changed their profile picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="chatbox">
          <span id="chattitle">Chat Box</span>
          {isUser ? (
            <Chatbox user={isUser} setuser={setUser} key={isUser.id} />
          ) : Friends.length > 0 ? (
            Friends.map((friend) => (
              <div
                key={friend.id}
                data-id={friend.id}
                className="user"
                onClick={handleClick}
              >
                <div className="userinfo">
                  <div className="userImg">
                    {checkImageURL(friend.profilepic) ? (
                      <img
                        src={".././profileimages/" + friend.profilepic}
                        alt="img"
                      />
                    ) : (
                      <PersonIcon id="defaultprofile" />
                    )}
                  </div>
                  <span>{friend.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div>No users available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;

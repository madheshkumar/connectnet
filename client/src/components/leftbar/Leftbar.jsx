import React, { useContext, useState, useEffect } from "react";
import "./leftbar.scss";
import { checkImageURL, AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import PersonIcon from "@mui/icons-material/Person";

const Leftbar = () => {
  const { currentUser, getFriends } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [friendsOpen, setFriendsOpen] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsList = await getFriends();
        setFriends(friendsList);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, [getFriends]);

  return (
    <div className="leftbar">
      <div className="container">
        <div className="menu">
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
          <div className="items" onClick={() => setFriendsOpen(!friendsOpen)}>
            <img src={Friends} alt="img"></img>
            <span>Friends</span>
          </div>
          {friendsOpen && (
            <div className="friends">
              {friends.length !== 0 ? (
                friends.map((friend) => (
                  <Link
                    to={`/profile/${friend.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="friend">
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
                  </Link>
                ))
              ) : (
                <span style={{color:"white"}}>No Friends! Add friends</span>
              )}
            </div>
          )}
          <div className="items">
            <img src={Gallery} alt="img"></img>
            <span>Gallery</span>
          </div>
          <div className="items">
            <img src={Videos} alt="img"></img>
            <span>Videos</span>
          </div>
          <div className="items">
            <img src={Groups} alt="img"></img>
            <span>Groups</span>
          </div>
          <div className="items">
            <img src={Watch} alt="img"></img>
            <span>Explore</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span id="subtitle">People Online</span>
        </div>
      </div>
    </div>
  );
};

export default Leftbar;

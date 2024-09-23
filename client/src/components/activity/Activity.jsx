import React, { useState, useContext, useEffect } from "react";
import "./activity.scss";

import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../axios";

export const Activity = ({ activity }) => {
  const { currentUser } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [friendData, setFriendData] = useState(null);
  const [postData, setPostData] = useState(null);

  const type = activity.activity.activitytype;
  const user = activity.userid;
  const time = activity.time;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await makeRequest(
          `/users/find/${activity.activity.userId}`
        );
        setUserData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchFriendData = async () => {
      try {
        const res = await makeRequest(
          `/users/find/${activity.activity.friendId}`
        );
        setFriendData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchPostData = async () => {
      try {
        const res = await makeRequest(`/posts/${activity.activity.postId}`);
        const data = await res.json();
        setPostData(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (activity.activity.userId) fetchUserData();
    if (activity.activity.friendId) fetchFriendData();
    if (activity.activity.postId) fetchPostData();
  }, [activity]);

  const renderActivities = () => {
    switch (type) {
      case "friendRequest":
        return activity.activity.status === "accepted" ? (
          <p>
            {activity.activity.userId === user ? (
              <span>You and </span>
            ) : (
              <span>
                {userData ? userData.name : activity.activity.userId} and{" "}
              </span>
            )}
            {activity.activity.friendId === user ? (
              <span>you</span>
            ) : (
              <span>
                {friendData ? friendData.name : activity.activity.friendId}
              </span>
            )}
            <span> are now friends</span>
          </p>
        ) : activity.activity.status === "pending" ? (
          <p>
            {activity.activity.userId === user ? (
              <span>
                Friend Request sent to{" "}
                {friendData ? friendData.name : activity.activity.friendId}
              </span>
            ) : (
              <div className="friendrequest">
                <span>
                  {userData ? userData.name : activity.activity.userId} has sent
                  you a friend request
                </span>
                <div className="requestbox">
                  <button>Accept</button>
                  <button>Decline</button>
                </div>
              </div>
            )}
          </p>
        ) : activity.activity.status === "declined" ? (
          <p>
            {activity.activity.userId === user ? (
              <span>You</span>
            ) : (
              <span>{userData ? userData.name : activity.activity.userId}</span>
            )}
            {activity.activity.friendId === user ? (
              <span> has declined your friend request</span>
            ) : (
              <span>
                {" "}
                have declined{" "}
                {friendData ? friendData.name : activity.activity.friendId}'s
                friend request
              </span>
            )}
          </p>
        ) : (
          <p>
            {activity.activity.userId === user ? (
              <span>You</span>
            ) : (
              <span>{userData ? userData.name : activity.activity.userId}</span>
            )}
            {activity.activity.friendId === user ? (
              <span> has un-friended you</span>
            ) : (
              <span>
                {" "}
                have un-friended{" "}
                {friendData ? friendData.name : activity.activity.friendId}
              </span>
            )}
          </p>
        );
      case "postLike":
        return (
          <p>
            {activity.activity.userId === user ? (
              <span>You</span>
            ) : (
              <span>{activity.activity.userId}</span>
            )}
            {}
          </p>
        );

      default:
        return null;
    }
  };
  return <div className="activity">{renderActivities()}</div>;
};

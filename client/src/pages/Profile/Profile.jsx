import React, { useState, useEffect, useContext } from "react";
import "./profile.scss";
import { AuthContext, checkImageURL } from "../../context/AuthContext";
import UpdateProfile from "../../components/updateprofile/UpdateProfile";
import Posts from "../../components/posts/Posts";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FriendIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";

import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getMonth()];
  // const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [updateUser, setUpdateUser] = useState(false);
  const [friends, setFriends] = useState([]);
  const userid = useLocation().pathname.split("/")[2];

  const { isPending, error, data } = useQuery({
    queryKey: ["user", userid],
    queryFn: async () => {
      const res = await makeRequest.get("/users/find/" + userid);
      return res.data;
    },
  });

  const isFriend = data ? friends : false;

  useEffect(() => {
    makeRequest.get("/users/friendid/" + currentUser.id).then((res) => {
      setFriends(res.data.map((friend) => friend.friendid));
    });
  }, [currentUser]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
 // console.log("data " + data);

  return (
    <div className="profile">
      <div className="images">
        <div className="coverpic">
          
          {
          checkImageURL(data.coverpic) ? (
            <img id="coverpic" src={".././coverimages/"+data.coverpic} alt="" />
          ) : (
            <div id="defaultcover"></div>
          )}
        </div>
        <div className="profilepic">
        
          {checkImageURL(data.profilepic) ? (
            <img id="profilepic" src={".././profileimages/"+data.profilepic} alt="" />
          ) : (
            <PersonIcon id="defaultprofile" />
          )
          }
        </div>
      </div>
      <div className="profilecontainer">
        <span id="name">{data.name}</span>
        <span id="dob">{data.DOB ? formatDate(data.DOB) : "No DOB info!"}</span>
        <div className="userinfo">
          <div className="item">
            <LocationOnIcon />
            <span>{data.city ? data.city : "No city info!"}</span>
          </div>
          <div className="item">
            <PhoneIcon />
            <span>{data.phoneno ? data.phoneno : "No contact info!"}</span>
          </div>
          <div className="item">
            <EmailIcon />
            <span>{data.email ? data.email : "User has not added email!"}</span>
          </div>
          <div className="item">
            <LanguageIcon />
            <span>
              {data.website ? data.website : "No website!"}
            </span>
          </div>
        </div>
        <div className="friend">
          {data.id === currentUser.id ? (
            <button onClick={() => setUpdateUser(!updateUser)}>
              Update Profile
            </button>
          ) : isFriend ? (
            <span>
              <FriendIcon /> Friends
            </span>
          ) : (
            <button>Add Friend</button>
          )}
        </div>
      </div>
      {updateUser && (
        <UpdateProfile setupdate={setUpdateUser}/>
      )}
      <div className="posts">
        <Posts userid={data.id} />
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useContext } from "react";
import "./updateprofile.scss";

import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const UpdateProfile = ({ setupdate }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [coverpic, setCoverpic] = useState(null);
  const [profilepic, setProfilepic] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updateUser) =>
      makeRequest.put("/users/" + currentUser.id, updateUser),
    onSuccess: async () => {
      queryClient.invalidateQueries(["users"]);

      const res = await makeRequest.get("/users/find/" + currentUser.id);
      setCurrentUser(res.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    let URL1 = "";
    let URL2 = "";
    if (coverpic) URL1 = await uploadCover();
    if (profilepic) URL2 = await uploadProfile();

    const updateData = {};
    if (
      (name !== currentUser.name && name.length !== 0) ||
      currentUser.name === null
    ) {
      updateData.name = name;
    }
    if (
      (dob !== currentUser.dob && dob.length !== 0) ||
      currentUser.DOB === null
    ) {
      updateData.dob = dob;
    }

    if (
      (website !== currentUser.website && website.length !== 0) ||
      currentUser.website === null
    ) {
      updateData.website = website;
    }
    if (
      (location !== currentUser.location && location.length !== 0) ||
      currentUser.location === null
    ) {
      updateData.location = location;
    }

    if (URL1) updateData.coverpic = URL1;
    if (URL2) updateData.profilepic = URL2;

    // console.log(updateData);
    if (Object.keys(updateData).length === 0) return;

    mutation.mutate(updateData);

    setName("");
    setDob("");
    setWebsite("");
    setLocation("");
    setCoverpic(null);
    setProfilepic(null);

    setupdate(false);
  };

  const uploadCover = async () => {
    try {
      const data = new FormData();
      data.append("cover", coverpic);
      const res = await makeRequest.post("/uploadcover", data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const uploadProfile = async () => {
    try {
      const data = new FormData();
      data.append("profile", profilepic);
      const res = await makeRequest.post("/uploadprofile", data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="updateprofile">
      <h2>Update Profile</h2>
      <div className="updatecontainer">
        <div className="updateleft">
          <div className="updateitem">
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="updateitem">
            <label>Date of Birth</label>
            <input
              type="date"
              placeholder="DOB"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="updateitem">
            <label>Website</label>
            <input
              type="text"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="updateitem">
            <label>Location</label>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="updateright">
          <label htmlFor="coverimg" className="updateImg">
            Update Cover Pic
          </label>
          <input
            type="file"
            id="coverimg"
            style={{ display: "none" }}
            onChange={(e) => setCoverpic(e.target.files[0])}
          />

          <label htmlFor="profileimg" className="shareImg">
            Update Profile Pic
          </label>
          <input
            type="file"
            id="profileimg"
            style={{ display: "none" }}
            onChange={(e) => setProfilepic(e.target.files[0])}
          />
        </div>
      </div>
      <div className="updatebuttons">
        <button onClick={handleUpdate}>Update</button>
        <button onClick={() => setupdate(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateProfile;

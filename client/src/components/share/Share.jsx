import React from "react";
import "./share.scss";

import Image from "../../assets/img.png";
import PersonIcon from "@mui/icons-material/Person";

import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import { useContext, useState } from "react";
import { AuthContext, checkImageURL } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleClick = async (event) => {
    event.preventDefault();
    let URL = "";
    if (file) URL = await upload();

    const sharepost = {};
    if(desc !== "") sharepost.desc = desc;
    if(URL !== "") sharepost.content = URL;

    console.log(sharepost);
    if (Object.keys(sharepost).length === 0) return;

    

    mutation.mutate(sharepost);

    setDesc("");
    setFile(null);
  };

  const upload = async () => {
    try {
      const data = new FormData();
      let endpoint = "/uploadimage";

      if (file.type.startsWith("video/")) {
        data.append("video", file);
        endpoint = "/uploadvideo";
      } else if (file.type.startsWith("image/")) {
        data.append("image", file);
      } else {
        throw new Error("Unsupported file type");
      }

      const res = await makeRequest.post(endpoint, data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="shareTop">
          <div className="userImg">
            {checkImageURL(currentUser.profilepic) ? (
              <img src={".././profileimages/"+currentUser.profilepic} alt="img" />
            ) : (
              <PersonIcon id="defaultprofile" />
            )}
          </div>
          <textarea
            className="textInput"
            placeholder={`Share your thoughts... `}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="file" className="shareImg">
            <img className="icon" src={Image} alt="img" />
            <span>add</span>
          </label>
          <button className="sharebtn" onClick={handleClick}>
            Share
          </button>
        </div>
        <div className="shareBottom">
          {file && (
            <div className="uploadedfile">
              {file.type.startsWith("video/") ? (
                <video
                  className="videoFile"
                  src={URL.createObjectURL(file)}
                  alt=""
                  autoPlay
                  loop
                ></video>
              ) : (
                <img className="imgFile" src={URL.createObjectURL(file)} />
              )}
              <p> {file.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Share;

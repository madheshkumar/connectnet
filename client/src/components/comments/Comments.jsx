import React, { useEffect, useState, useContext } from "react";
import "./comments.scss";
import moment from "moment";
import { checkImageURL, AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import PersonIcon from "@mui/icons-material/Person";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Comments = ({ postId, CommentsCount }) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleClick = async (event) => {
    event.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    if (data) {
      CommentsCount(data.length);
    }
  }, [data, CommentsCount]);

  return (
    <div className="comments">
      <div className="write">
        <div className="userImg">
          {checkImageURL(currentUser.profilepic) ? (
            <img src={".././profileimages/"+currentUser.profilepic} alt="img" />
          ) : (
            <PersonIcon id="defaultprofile" />
          )}
        </div>
        <input
          type="text"
          placeholder="write your comments "
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Comment</button>
      </div>
      {error ? (
        <p className="commentmessage">something went wrong</p>
      ) : isPending ? (
        <p className="commentpostmessage">loading</p>
      ) : (
        data.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="userImg">
              {checkImageURL(comment.profilepic) ? (
                <img src={".././profileimages/"+currentUser.profilepic} alt="img" />
              ) : (
                <PersonIcon id="defaultprofile" />
              )}
            </div>

            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>

            <div className="date">{moment(comment.time).fromNow()}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;

import React, { useEffect } from "react";
import "./posts.scss";
import Post from "../post/Post";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ userid }) => {


  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts").then((res) => {
        return res.data;
      }),
  });


  //console.log(data ,userid);

  return (
    <div className="posts">
      {error ? (
        <p className="postmessage">something went wrong</p>
      ) : isPending ? (
        <p className="postmessage">loading</p>
      ) : data.length > 0 ? (
        userid ? (
          data.filter((post) => post.userid === userid)
          .map((post) => <Post post={post} key={post.id} />)
        ) : (
          data.map((post) => <Post post={post} key={post.id} />)
        )
      ) : (
        <p className="postmessage">No posts in your feed</p>
      )}
    </div>
  );
};

export default Posts;

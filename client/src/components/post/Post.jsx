import React, { useEffect, useState, useRef, useContext } from "react";
import "./post.scss";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import moment from "moment";

import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { AuthContext, checkImageURL } from "../../context/AuthContext";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);

  const videoRef = useRef(null);

  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likes, setLikes] = useState(0);

  const fetchLikes = async () => {
    try {
      const res = await makeRequest.get(`/likes?postId=${post.id}`);
      res.data.includes(currentUser.id) ? setLiked(true) : setLiked(false);
      setLikes(res.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCommentsCount = async () => {
    try {
      const res = await makeRequest.get(`/comments?postId=${post.id}`);
      setCommentsCount(res.data.length);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLikes();
    fetchCommentsCount();
  }, [post.id]);

  const {
    isPending,
    error,
    likesdata = [],
  } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const handleLike = (e) => {
    try {
      if (liked) {
        makeRequest.delete(`/likes?postId=${post.id}`);
        setLiked(false);
        setLikes(likes - 1);
      } else {
        makeRequest.post("/likes", { postId: post.id });
        setLiked(true);
        setLikes(likes + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentCount = (count) => {
    setCommentsCount(count);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (videos) => {
        videos.forEach((e) => {
          if (e.isIntersecting) {
            e.target.play();
            e.target.setAttribute("controls", "controls");
          } else {
            e.target.pause();
            e.target.removeAttribute("controls");
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userinfo">
            <div className="userImg">
              {checkImageURL(post.profilepic) ? (
                <img src={".././profileimages/" + post.profilepic} alt="img" />
              ) : (
                <PersonIcon id="defaultprofile" />
              )}
            </div>
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreVertIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.content &&
            (post.content.match(/.(jpeg|jpg|gif|png)$/) ? (
              <img src={".././postimages/" + post.content} alt="" />
            ) : (
              <video
                ref={videoRef}
                src={".././postvideos/" + post.content}
                alt=""
                autoPlay
                muted
                controls
                onMouseEnter={(e) => {
                  e.target.muted = false;
                  e.target.setAttribute("loop", " ");
                }}
                onClick={(e) => {
                  e.target.muted = false;
                  e.target.setAttribute("loop", " ");
                }}
              ></video>
            ))}
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? (
              <FavoriteIcon style={{ color: "#0030ab" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
            <span>{likes} Likes</span>
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <CommentIcon />
            <span>{commentsCount} Comments</span>
          </div>
          <div className="item">
            <ShareIcon />
            <span>Share</span>
          </div>
        </div>
        {commentOpen && (
          <Comments postId={post.id} CommentsCount={handleCommentCount} />
        )}
      </div>
    </div>
  );
};

export default Post;

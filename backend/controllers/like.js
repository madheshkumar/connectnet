import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
    const postId = req.query.postId;
  const q = `SELECT userid FROM likes WHERE postid = ?;`;

  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data.map( like => like.userid));
  });
};
export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token ) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO likes(`userid`,`postid`) VALUES (?);";

        const values = [userInfo.id, req.body.postId];

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json("post has been liked!");
        });
    })
};
export const deleteLike = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token ) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM likes WHERE `userid` = ? AND `postid` = ?;";

        const values = [userInfo.id, req.query.postId];

        db.query(q, values, (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json("like has been removed!");
        });
    })
};

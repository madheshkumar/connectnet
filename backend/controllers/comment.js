import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.name, u.profilepic FROM comments AS c JOIN users AS u ON (c.userid = u.id) 
    WHERE c.postid = ? ORDER BY c.time DESC;`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const addComments = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status("403").json("Token is not valid!");

    const q =
      "INSERT INTO comments(`desc`,`time`,`userid`,`postid`) VALUES (?);";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("comment has been created!");
    });
  });
};

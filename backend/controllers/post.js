import { db } from "../connect.js";
import moment from "moment/moment.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status("403").json("Token is not valid!");

    //console.log(userInfo.id);

    const q = `SELECT DISTINCT p.*, u.id as userId, u.name,u.profilepic FROM posts AS p JOIN users AS u ON (u.id = p.userid)
     LEFT JOIN relations as r on (r.friendid = p.userid) where r.userid = ? or p.userid = ? ORDER BY createdAt desc;`;
    db.query(q, [userInfo.id,userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};

export const addPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status("403").json("Token is not valid!");

    let query = "INSERT INTO posts(";
    const queryParams = [];

    const {desc, content} = req.body;

    if(desc){
      query += "`desc`,";
      queryParams.push(desc);
    }
    if(content){
      query += "`content`,";
      queryParams.push(content);
    }

    query+="`createdAt`,`userid`) VALUES (?);";
    queryParams.push(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
    queryParams.push(userInfo.id);

    // const q = "INSERT INTO posts(`desc`,`content`,`createdAt`,`userid`) VALUES (?);";

    // const values = [
    //   req.body.desc,
    //   req.body.content,
    //   moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    //   userInfo.id
    // ]
    
    db.query(query, [queryParams], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("post has been created!");
    });
  });
};

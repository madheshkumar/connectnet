import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUsers = (req, res) => {
  const q = `SELECT * FROM users;`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No users found!");

    return res.status(200).json(data);
  });
};

export const getUser = (req, res) => {
  const userid = req.params.userid;
  const q = `SELECT * FROM users WHERE id = ?;`;

  db.query(q, userid, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const { password, ...rest } = data[0];

    return res.status(200).json(rest);
  });
};

export const getFriendDetails = (req, res) => {
  const userId = req.params.userId;
 
  const q = `SELECT * FROM users where id = any(select friendid from relations where userid = ? );`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getFriendids = (req, res) => {
  const userId = req.params.userId;

  const q = `select friendid from relations where userid = ? ;`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No friends found!");
    return res.status(200).json(data);
  });
};

export const updateUser = (req, res) => {
  const userId = req.params.userId;
  const { name, dob, phoneno, website, location, coverpic, profilepic } =
    req.body;

  let query = "UPDATE users SET ";
  const queryParams = [];

  if (name) {
    query += "name = ?, ";
    queryParams.push(name);
  }
  if (dob) {
    query += "DOB = ?, ";
    queryParams.push(dob);
  }
  if (phoneno) {
    query += "phoneno = ?, ";
    queryParams.push(phoneno);
  }
  if (website) {
    query += "website = ?, ";
    queryParams.push(website);
  }
  if (location) {
    query += "city = ?, ";
    queryParams.push(location);
  }
  if (coverpic) {
    query += "coverpic = ?, ";
    queryParams.push(coverpic);
  }
  if (profilepic) {
    query += "profilepic = ?, ";
    queryParams.push(profilepic);
  }

  query = query.slice(0, -2);

  query += " WHERE id = ?";
  queryParams.push(userId);

  console.log(query, queryParams);

  db.query(query, queryParams, (err, data) => {
    if (err) return res.status(500).json(err);
    console.log(data);
    return res.status(200).json(data);
  });
};

export const addFriend = (req, res) => {
  const { userId, friendId } = req.body;
  const q = `INSERT INTO relations (userid, friendid) VALUES (?, ?);`;

  db.query(q, [userId, friendId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

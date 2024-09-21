import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //check for username
  const q1 = "SELECT * from users WHERE username = ?";

  db.query(q1, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //create a new user
    // hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q2 =
      "INSERT INTO users(`username`,`email`, `password`, `name`) VALUE (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q2, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created successfully.");
    });
  });
};

export const login = (req, res) => {
  const q1 = "Select * from users Where username = ?";
  db.query(q1, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) return res.status(409).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("wrong user or password mismatch!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res.cookie("accessToken", token, {
        htmlOnly: true,
      })
      .status(200)
      .json(others);
  });
};
export const logout = (req, res) => {

    console.log("logout");

    res.clearCookie("accessToken", {
      httpOnly: true,
    })
    .status(200)
    .json("User has been logged out.");

};

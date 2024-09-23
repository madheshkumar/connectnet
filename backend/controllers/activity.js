import { db } from "../connect.js";
import moment from "moment/moment.js";

export const getActivities = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT * FROM activities WHERE userid = ?;`;

  db.query(q, userId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const logActivity = (req, res) => {
  const { userId, activity } = req.body;
  const time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const q = `INSERT INTO activities (userid, activity, time) VALUES (?, ?, ?);`;

  db.query(q, [userId, activity, time], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteActivity = (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM activities WHERE _id = ?;`;

  db.query(q, id, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};


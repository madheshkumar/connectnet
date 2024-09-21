import { db } from "../connect.js";

export const getActivities = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT * FROM activities WHERE userid = ?;`;

  db.query(q, userId, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No activities found!");

    return res.status(200).json(data);
  });
};


export const logActivity = (req, res) => {
  const { userId, activity, type } = req.body;
  const q = `INSERT INTO activities (userid, activity, type) VALUES (?, ?, ?);`;

  db.query(q, [userId, activity, type], (err, data) => {
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


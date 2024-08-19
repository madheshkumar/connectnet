import {db} from "../connect.js";
import moment from "moment/moment.js";

export const getMessages = (req, res) => {
    const senderId = req.params.userId;
    const receiverId = req.params.friendId;

    const q = `SELECT * FROM messages WHERE (senderid = ? AND receiverid = ?) 
    OR (senderid = ? AND receiverid = ?) ORDER BY createdAt;`;

    db.query(q,[senderId,receiverId,receiverId,senderId], (err, result)=>{
        if(err){
            console.log(err);
        }
        return res.status(200).json(result);
    });
}

export const addMessage = (req, res) => {

    const userId = req.params.userId;
    const friendId = req.params.friendId;
    const message = req.body.message;
    const datetime = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    const q = `INSERT INTO messages (senderid, receiverid, message,createdAt) VALUES (?,?,?,?)`;

    const values = [userId, friendId, message, datetime];
    db.query(q, values, (err, result) => {
        
        if (err) {
            console.log(err);
        }
        
        res.json("message sent");
    });


}


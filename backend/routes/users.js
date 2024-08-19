import Express from "express";
import { getUsers, getUser, updateUser, getFriendDetails, getFriendids, addFriend } from "../controllers/user.js";

const router = Express.Router();
router.get("/",getUsers);
router.get("/find/:userid", getUser);

router.put("/:userId", updateUser);                                                 

router.get("/friendid/:userId", getFriendids);
router.get("/friends/:userId", getFriendDetails);

router.post("/friends/add", addFriend);

export default router;

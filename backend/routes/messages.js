import Express from "express";

import { getMessages, addMessage } from "../controllers/message.js";

const router = Express.Router();

router.get("/:userId/:friendId", getMessages);
router.post("/:userId/:friendId", addMessage);

export default router;
import Express from "express";
import { addComments, getComments } from "../controllers/comment.js";


const router = Express.Router();

router.get("/",getComments);
router.post("/",addComments);

export default router;
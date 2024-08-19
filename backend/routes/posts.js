import Express from "express";
import { getPosts , addPosts } from "../controllers/post.js";

const router = Express.Router();

router.get("/",getPosts);
router.post("/",addPosts);

export default router;
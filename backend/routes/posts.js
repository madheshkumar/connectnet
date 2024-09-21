import Express from "express";
import { getPosts , addPosts, deletePosts } from "../controllers/post.js";

const router = Express.Router();

router.get("/",getPosts);
router.post("/",addPosts);
router.delete("/:postid",deletePosts);

export default router;
import Express from "express";
import { getPosts ,getPost, addPosts, deletePosts } from "../controllers/post.js";

const router = Express.Router();

router.get("/",getPosts);
router.get("/:postId", getPost);
router.post("/",addPosts);
router.delete("/:postid",deletePosts);

export default router;
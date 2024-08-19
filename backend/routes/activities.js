import Express from "express";
import {getActivities,logActivity,deleteActivity} from "../controllers/activity.js";

const router = Express.Router();

router.get("/:userId", getActivities);
router.post("/", logActivity);
router.delete("/:id", deleteActivity);

export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { createComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controllers.js";

const router = Router();

router.route("/:videoId").get(verifyJWT, getVideoComments);
router.route("/:videoId").post(verifyJWT, createComment);
router.route("/c/:commentId").patch(verifyJWT, updateComment);
router.route("/c/:commentId").delete(verifyJWT, deleteComment);

export default router;
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";

const router = Router();

router.route("/toggle/video/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/toggle/comment/:commentId").post(verifyJWT, toggleCommentLike)
router.route("/toggle/tweet/:tweeId").post(verifyJWT, toggleTweetLike)
router.route("/videos").get(verifyJWT, getLikedVideos)

export default router;
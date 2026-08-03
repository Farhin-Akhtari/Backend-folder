import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createTweet, deleteTweet, getAllTweet, getTweetById, updateTweet } from "../controllers/tweet.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, createTweet);
router.route("/").get(verifyJWT, getAllTweet);
router.route("/:tweetId")
.get(verifyJWT, getTweetById)
.patch(verifyJWT, updateTweet)
.delete(verifyJWT, deleteTweet);

export default router;
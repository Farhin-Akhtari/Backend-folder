import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getSubscribedChannels, getUserChannelSubscription, toggleSubscription } from "../controllers/subscription.controllers.js";

const router = Router();

router.route("/c/:channelId").post(verifyJWT, toggleSubscription);
router.route("/c/:channelId").get(verifyJWT, getUserChannelSubscription);
router.route("/").get(verifyJWT, getSubscribedChannels);

export default router;
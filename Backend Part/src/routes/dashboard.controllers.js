import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { getChannelStats } from "../controllers/dashboard.controllers.js";

const router = Router();

router.route("/").get(verifyJWT, getChannelStats);

export default router
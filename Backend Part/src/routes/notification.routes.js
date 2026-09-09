import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { markNotificationAsRead, getUserNotification } from "../controllers/notification.controllers.js";

const router = Router();

router.route("/").get(verifyJWT, getUserNotification);
router.route("/:notificationId/read").patch(verifyJWT, markNotificationAsRead);

export default router;
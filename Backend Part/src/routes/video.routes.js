import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, toggleStatus, updateVideo } from "../controllers/video.controllers.js";

const router = Router();

router.route("/")
    .get(verifyJWT, getAllVideos)
    .post(verifyJWT, upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        publishVideo
    );

    router.route("/:videoId")
    .get(verifyJWT, getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

    router.route("/:videoId/publish").patch(verifyJWT, toggleStatus);

    export default router;
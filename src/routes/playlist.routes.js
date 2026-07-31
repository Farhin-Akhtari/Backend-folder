import { Router } from "express";
import { verifyJWT} from "../middlewares/auth.middlewares.js";
import { createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylist, updatePlaylist, addVideoToPlaylist, removeVideoFromPlaylist } from "../controllers/playlist.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);
router.route("/user/:userId").get(verifyJWT, getUserPlaylist);
router.route("/:playlistId")
    .get(verifyJWT, getPlaylistById)
    .delete(verifyJWT, deletePlaylist)
    .patch(verifyJWT, updatePlaylist);
router.route("/:playlistId/videos/:videoId")
    .post(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist);

export default router
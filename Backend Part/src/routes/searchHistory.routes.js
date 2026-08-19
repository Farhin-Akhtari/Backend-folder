import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import { addSearchHistory, getSearchHistory, deleteSearchHistory, clearSearchHistory } from "../controllers/searchHistory.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, addSearchHistory);
router.route("/").get(verifyJWT, getSearchHistory);
router.route("/:searchHistoryId").delete(verifyJWT, deleteSearchHistory)
router.route("/").delete(verifyJWT, clearSearchHistory);


export default router;
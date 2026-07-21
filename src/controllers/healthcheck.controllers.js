import mongoose from "mongoose";
import { asyncHandler} from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

const healthCheck = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, {message: "Everything is ok"}, "ok"))
})

export {healthCheck}
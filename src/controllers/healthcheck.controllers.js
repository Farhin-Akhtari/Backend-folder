import mongoose from "mongoose";
import { asyncHandler} from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";

const healthCheck = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, {message: "Everything is ok"}, "ok"))
})

export {healthCheck}
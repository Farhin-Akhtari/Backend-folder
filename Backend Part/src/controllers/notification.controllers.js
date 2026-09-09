import {Notification} from "../models/notification.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const {notificationId} = req.params;

    if(!isValidObjectId(notificationId)){
        throw new ApiError(400, "Invlaid notification ID");
    }

    const notification = await Notification.findById(notificationId)

    if(!notification){
        throw new ApiError(404, "NOTIFICATION NOT FOUND");
    }

    //AUTHORIZATION
    if(notification.recipient.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to update this notification");
    }

    notification.isRead = true;
    await notification.save();

    return res
    .status(200)
    .json(new ApiResponse(200, notification, "NOTIFICATION MARKED AS READ"))
})

const getUserNotification = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({
        recipient: req.user._id,
        isRead: false
    })
    .populate("sender", "username fullName avatar")
    .populate("video", "title thunbnail")
    .populate("comment", "content")
    .sort({createdAt: -1});

    return res
    .status(200)
    .json(new ApiResponse(200, notifications, "NOTIFICATIONS FETCHED SUCCESSFULLY"))
})

export {markNotificationAsRead, getUserNotification}
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Like } from "../models/like.models.js"
import {uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"


//get video comments
const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "INVALID VIDEO ID");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "VIDEO NOT FOUND");
    }

    const videoComment = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                         $project: {
                            _id: 1,
                            username: 1,
                            "avatar.url": 1,
                         }
                    }
                ]
            } 
        },
        {
             $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
          $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$ownerDetails"
                },
                isLiked: {   
                    //$in already return true or false
                   $in: 
                   [new mongoose.Types.ObjectId(req.user?._id), "$likes.likedBy"],
                },
            }
        },
        {
           $sort: {
              createdAt: -1
            }   
        },
        {
            $project: {
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                content: 1,
                createdAt: 1

            }
        }
    ])
    if(videoComment.length === 0){
         return res
        .status(200)
        .json(new ApiResponse(200, [], "No comments found"));
     }

     return res
     .status(200)
     .json(new ApiResponse(200, videoComment, "Comments fetched successfully"))
})

export {getVideoComments}
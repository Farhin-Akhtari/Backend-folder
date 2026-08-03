import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Like } from "../models/like.models.js"


//get video comments
const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "INVALID VIDEO ID");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "VIDEO NOT FOUND");
    }

    const aggregate = Comment.aggregate([
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
                            fullName: 1,
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

    const options = {
        page: Number(page),
        limit: Number(limit)
    }

    const videoComment = await Comment.aggregatePaginate(aggregate, options);

     return res
     .status(200)
     .json(new ApiResponse(200, videoComment, "Comments fetched successfully"))
})

//Creating comments
const createComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
         throw new ApiError(400, "INVALID VIDEO ID")
    }

    const video = await Video.findById(videoId);
    
        if(!video){
            throw new ApiError(404, "VIDEOS NOT FOUND")
        }

    const {content} = req.body;

        if(!content?.trim()){
            throw new ApiError(400, "CONTENT IS REQUIRED")
        }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    const checkComment = await Comment.findById(comment._id)
    .populate("owner", "username fullName avatar");

    if(!checkComment){
        throw new ApiError(500, "FAILED TO FETCHED CREATED COMMENT")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, checkComment, "COMMENT CREATED SUCCESSFULLY"));

})

//Deleting comments
const deleteComment = asyncHandler(async (req, res) => {
    const{commentId} = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "INVALID CONTENT ID")
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "COMMENT NOT FOUND")
    }

    const video = await Video.findById(comment.video);
    if(!video){
        throw new ApiError(404, "VIDEO NOT FOUND")
    }

    if(comment.owner.toString() !== req.user._id.toString() && video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "YOU ARE NOT AUTHORIZED TO DELETE THIS COMMENT")
    }

     const deleted = await Comment.findByIdAndDelete(commentId)
     if(!deleted){
         throw new ApiError(500, "FAILED TO DELETE COMMENT");
     }

    return res
    .status(200)
    .json(new ApiResponse(200, {deleted: true}, "COMMENT DELETED SUCCESSFULLY"))

})

//Updating comments
const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "INVALID COMMENT ID")
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "COMMENT NOT FOUND");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "YOU ARE NOT AUTHORIZED TO UPDATE THIS COMMENT")
   }

    const {content} = req.body;
    if (!content?.trim()) {
    throw new ApiError(400, "CONTENT IS REQUIRED");
    }

    const updated = await Comment.findByIdAndUpdate(commentId,{
        $set: {
            content: content.trim(),
          },
        },
        {
           new: true,
        }
    ).populate("owner", "username fullName avatar")
    
    if(!updated){
        throw new ApiError(500, "FAILED TO UPDATE");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updated, "COMMENT UPDATED SUCCESSFULLY"))
  
})

export {getVideoComments, createComment, deleteComment, updateComment}
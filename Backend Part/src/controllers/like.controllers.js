import mongoose, {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Like } from "../models/like.models.js"
import { Tweet } from "../models/tweet.models.js";

//Toggle video likes
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
     if(!isValidObjectId(videoId)){
            throw new ApiError(400, "INVALID VIDEO ID");
        }
    
    const video = await Video.findById(videoId);
        if(!video){
            throw new ApiError(404, "VIDEO NOT FOUND");
        }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "video unliked successfully"));
    }

    const newLike = await Like.create({
         video: videoId,
        likedBy: req.user._id
    })

     return res
     .status(200)
     .json(new ApiResponse(200, {liked: true}, "video liked successfully"));

})

//Toggle comment likes
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
     if(!isValidObjectId(commentId)){
            throw new ApiError(400, "INVALID COMMENT ID");
        }
    
    const comment = await Comment.findById(commentId);
        if(!comment){
            throw new ApiError(404, "COMMENT NOT FOUND");
        }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "comment unliked successfully"));
    }

    const newLike = await Like.create({
         comment: commentId,
        likedBy: req.user._id
    })

     return res
     .status(200)
     .json(new ApiResponse(200, {liked: true}, "comment liked successfully"));

})

//Toggle tweet likes
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
     if(!isValidObjectId(tweetId)){
            throw new ApiError(400, "INVALID TWEET ID");
        }
    
    const tweet = await Tweet.findById(tweetId);
        if(!tweet){
            throw new ApiError(404, "TWEET NOT FOUND");
        }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "Tweet unliked successfully"));
    }

    const newLike = await Like.create({
         tweet: tweetId,
        likedBy: req.user._id
    })

     return res
     .status(200)
     .json(new ApiResponse(200, {liked: true}, "Tweet liked successfully"));

})

//get video like
const getLikedVideos = asyncHandler(async(req, res) => {
    const like = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
              from: "videos",
              localField: "video",
              foreignField: "_id",
              as: "likedVideos",
              pipeline: [
                {
                  $lookup: {
                     from: "users",
                      localField: "owner",
                     foreignField: "_id",
                     as: "ownerDetails",
                     pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                "avatar.url": 1
                            }
                        }
                     ]
                    }
                },
                 {
                    $addFields: {
                        owner: {
                            $first: "$ownerDetails"
                        }
                    }
                },
                {
                    $project: {
                        title: 1,
                        thumbnail: 1,
                        duration: 1,
                        views: 1,
                        createdAt: 1,
                        owner: 1,
                    }
                }
              ]
            }
        },
        {
            $addFields: {
                likedVideo: {
                    $first: "$likedVideos"
                },
            }
        },
        {
            $project: {
                 _id: 0,
                 likedVideo: 1
            }
        }
    ])

    return res 
    .status(200)
    .json(new ApiResponse(200, like, "LIKE FETHCED SUCCESSFULLY"))
})

export {toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos}
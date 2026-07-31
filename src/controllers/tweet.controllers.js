import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Tweet } from "../models/tweet.models.js";

//create tweet
const createTweet = asyncHandler(async (req, res) => {

    const {content} = req.body;
    if(!content?.trim()){
        throw new ApiError(404, "TWEET CONTENT REQUIRED")
    }

    const newTweet = await Tweet.create({
                content: content.trim(),
                owner: req.user._id,
    })

    if(!newTweet){
        throw new ApiError(500, "FAILED TO CREATE TWEET")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, newTweet, "TWEET CREATED SUCCESSFULLY"))

})

//update tweet
const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "INVALID TWEET ID")
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "TWEET NOT FOUND")
    }

    if(tweet?.owner?.toString() !== req.user._id.toString()){
        throw new ApiError(403, "YOU ARE NOT AUTHORIZED TO UPDATE THE TWEET")
    }

    const {content} = req.body;

    if(!content?.trim()){
        throw new ApiError(400, "TWEET CONTENT IS REQUIRED");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,{
        $set: {
            content: content.trim(),
        }
    },
       {
            new: true,
        }
    )

    if(!updatedTweet){
        throw new ApiError(500, "FAILED TO UPDATE TWEET")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "TWEET UPDATED SUCCESSFULLY"))

})

//deleted tweet
const deleteTweet = asyncHandler(async (req, res) => {
     const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "INVALID TWEET ID")
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "TWEET NOT FOUND")
    }

    if(tweet?.owner?.toString() !== req.user._id.toString()){
        throw new ApiError(403, "YOU ARE NOT AUTHORIZED TO DELETE THE TWEET")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    if(!deleteTweet){
        throw new ApiError(500, "FAILED TO DELETE TWEET");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "TWEET DELETED SUCCESSFULLY"))

})

//get tweet by id
const getTweetById = asyncHandler(async( req, res) => {
     const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "INVALID TWEET ID")
    }
   
    const getTweet = await Tweet.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $lookup: {
               from: "likes",
               localField: "_id",
               foreignField: "tweet",
               as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                isLiked: {
                    $in: [
                        new mongoose.Types.ObjectId(req.user._id),
                        "$likes.likedBy"
                    ]
                }
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
                            username: 1,
                            fullName: 1,
                            "avatar.url" : 1,
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
                content: 1,
                likesCount: 1,
                isLiked: 1,
                owner: 1,
                createdAt: 1
            }
        }
    ])

    if(!getTweet.length){
        throw new ApiError(404, "TWEET NOT FOUND")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, getTweet[0], "TWEET FETCHED SUCCESSFULLY"))
})

//get all tweet
const getAllTweet = asyncHandler(async(req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

   const skip = (page - 1) * limit;

   const tweet = await Tweet.aggregate([
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $skip: skip
    },
    {
        $limit: limit
    },
    {
        $lookup: {
             from: "likes",
               localField: "_id",
               foreignField: "tweet",
               as: "likes"
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
                            username: 1,
                            fullName: 1,
                            "avatar.url" : 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$ownerDetails"
                },
                likesCount: {
                    $size: "$likes"
                },
                isLiked: {
                    $in: [
                      new mongoose.Types.ObjectId(req.user._id),
                     "$likes.likedBy"
                    ]
                }
            }
        },
        {
            $project: {
                content: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                createdAt: 1

            }
        }
   ])

   if(!tweet.length){
    throw new ApiError(404, "TWEET NOT FOUND")
   }

   return res
   .status(200)
   .json(new ApiResponse(200, tweet, "ALL TWEET FETCHED SUCCESSFULLY"))

})

export {createTweet, updateTweet, deleteTweet, getTweetById, getAllTweet}
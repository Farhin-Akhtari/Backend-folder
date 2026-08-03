import mongoose, {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Like } from "../models/like.models.js"
import { Playlist } from "../models/playlist.models.js"
import { Subscription } from "../models/subscription.models.js"
import { Tweet } from "../models/tweet.models.js";

//get the channel status - total (videos, likes, comment, subscription, views)
const getChannelStats = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    
    const videoStat = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                 _id: null,
                totalViews: {
                    $sum: "$views"
                },
                totalVideos: {
                    $sum: 1
                }
            }
        }
    ]);

    const videoStats = videoStat.length > 0
    ? videoStat[0]
    : {
        totalVideos: 0,
        totalViews: 0
    };

     const subscriptionStat = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                 _id: null,
                totalSubscribers : {
                    $sum: 1
                },
            }
        }
    ]);

    const subscriptionStats = subscriptionStat.length > 0
    ? subscriptionStat[0]
    : {
        totalSubscribers: 0
    };

   const commentStat = await Comment.aggregate([
    {
        $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "videoDetails"
        }
    },
    {
        $unwind: "$videoDetails"
    },
    {
        $match: {
            "videoDetails.owner": new mongoose.Types.ObjectId(userId)
        }
    },
    {
        $group: {
          _id: null,
           totalComments: {
              $sum: 1
            }
        }
    }
   ])

    const commentStats = commentStat.length > 0
    ? commentStat[0]
    : {
        totalComments: 0
    };

     const likeStat = await Like.aggregate([
    {
        $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "videoDetails"
        }
    },
    {
        $unwind: "$videoDetails"
    },
    {
        $match: {
            "videoDetails.owner": new mongoose.Types.ObjectId(userId)
        }
    },
    {
        $group: {
          _id: null,
           totalLikes: {
              $sum: 1
            }
        }
    }
   ])

    const likeStats = likeStat.length > 0
    ? likeStat[0]
    : {
        totalLikes: 0
    };

  return res
    .status(200)
    .json(
       new ApiResponse(
        200,{
        videoStats,
        subscriptionStats,
        commentStats,
        likeStats
        },
        "CHANNEL STATS FETCHED SUCCESSFULLY"
        )
    );
})

//get all videos uploaded by the channel

export {getChannelStats}
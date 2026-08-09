import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Like } from "../models/like.models.js"
import {uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"

//get all videos based on query, sort, pagination
const getAllVideos = asyncHandler(async (req, res) => {
 const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query;
  console.log(userId);

  //MATCH CONDITION
  const matchConditions = {};
  //for searching videos using title and description
  if(query?.trim()){
    matchConditions.$or = [
         {
            title: {
                $regex: query,
                $options: "i"
            }
        },
        {
            description: {
                $regex: query,
                $options: "i"
            }
        }
    ];
  }
  //check userIdexist then convert it into objectId and then add to object
  if(userId){
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "INVALID USER ID");
    }
    matchConditions.owner = new mongoose.Types.ObjectId(userId);

     // If this isn't the logged-in user's channel,
    // only show published videos.
    if(!req.user || userId !== req.user._id.toString()){
        matchConditions.isPublished = true;
    }
  }else{
    //there is no user id (home page)
    matchConditions.isPublished = true;
  }
  
 //SORT CONDITION
 const sortConditions = {};

  if (sortBy) {
    sortConditions[sortBy] = sortType === "asc" ? 1 : -1;
   } else {
    sortConditions.createdAt = -1;
    }

    //SKIP AND LIMIT CONDITION
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

  const video = await Video.aggregate([
    {
        $match: matchConditions
    },
    {
        $sort: sortConditions
    },
    {
        $skip: skip
    },
    {
        $limit: limitNumber
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
                        "avatar.url" : 1
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "likes"
        }
    },
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "video",
            as: "comments"
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
           isLiked: req.user
             ? {
               $in: [
                  new mongoose.Types.ObjectId(req.user._id),
                  "$likes.likedBy"
                ]
                }
                : false,
            commentsCount: {
                $size: "$comments"
            }
        }
    },
    {
    $project: {
        title: 1,
        "thumbnail.url": 1,
        duration: 1,
        views: 1,
        createdAt: 1,
        owner: 1,
        likesCount: 1,
        isLiked: 1,
        commentsCount: 1
        }
    }
    
  ])


  return res
  .status(200)
  .json(new ApiResponse(200, video, "VIDEO FETCHED SUCCESSFULLY"));

})

//publish video
const publishVideo = asyncHandler(async (req, res) => {
    const {title, description} = req.body;

    if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
    }

    if (!description?.trim()) {
    throw new ApiError(400, "Description is required");
    }

    const videoFile = req.files?.videoFile?.[0]?.path;

    if (!videoFile) {
     throw new ApiError(400, "Video file is required");
     }

    const thumbnail = req.files?.thumbnail?.[0]?.path;

    if (!thumbnail) {
      throw new ApiError(400, "Thumbnail is required");
     }

    const uploadedVideo = await uploadOnCloudinary(videoFile, "video")
    console.log("uploaded video: ", uploadedVideo)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail)
    console.log("uploaded thumbnail:", uploadedThumbnail)

    if (!uploadedVideo?.url) {
    throw new ApiError(500, "Video upload failed");
    }

    if (!uploadedThumbnail?.url) {
    await deleteOnCloudinary(uploadedVideo.public_id, "video");
    throw new ApiError(500, "Thumbnail upload failed");
    }

    try {
        const video = await Video.create({
            title,
            description,
    
            videoFile: {
                url: uploadedVideo.url,
                public_id: uploadedVideo.public_id
            },
             thumbnail: {
                url: uploadedThumbnail.url,
                public_id: uploadedThumbnail.public_id
            },
    
            duration: uploadedVideo.duration,
            owner: req.user?._id
        })
           return res 
           .status(201)
           .json(new ApiResponse(201, video, "VIDEO PUBLISHED SUCCESSFULLY"))

    } catch (error) {
         await deleteOnCloudinary(uploadedVideo.public_id, "video");
         await deleteOnCloudinary(uploadedThumbnail.public_id);
         throw new ApiError(500, "VIDEO PUBISH FAILED");
        }

})

//get videos by id
const getVideoById = asyncHandler(async (req, res) => {
    const{videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "INVALID VIDEO ID");
    }

    const existVideo = await Video.findById(videoId);
    if(!existVideo){
        throw new ApiError(404, "VIDEO NOT FOUND")
    }

     if(!existVideo.isPublished){
        if(!req.user || existVideo?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "NOT AUTHORIZED.")
    }
    }
    await Video.findByIdAndUpdate(
        videoId,
         {
            $inc: {
              views: 1
            }
         }
    );

     const userId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id) : null;

    const video = await Video.aggregate([
        {
            //choose only one document at a time
           $match: {
           _id: new mongoose.Types.ObjectId(videoId)
           }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments"
            }
        },
        {
            //stage that joins another collection
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $lookup:{
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                            $size: "$subscribers"
                            },
                            isSubscribed: userId
                            ? {
                        //$in act as if statement so we don't have to write seperately
                                $in: 
                                [userId, "$subscribers.subscriber"],
                            }
                             :false
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            "avatar.url": 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
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
                 commentsCount: {
                     $size: "$comments"
                },
                isLiked: userId
                ? {   
                    //$in already return true or false
                   $in: 
                   [userId, "$likes.likedBy"],
                    }
                    :false
            }
        },
        {
            $project: {
                "videoFile.url": 1,
                "thumbnail.url": 1,
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                isPublished: 1,
                commentsCount: 1
            }
        }
    ])

    if (!video.length) {
      throw new ApiError(404, "VIDEO NOT FOUND");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video[0], "video fetched successfully"))

})

//Update video
const updateVideo = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "INVALID VIDEO ID")
    }

    console.log("UPDATED VIDEO CONTROLLER CALLED: ")

    const {title, description} = req.body;

    if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
    }

    if (!description?.trim()) {
    throw new ApiError(400, "Description is required");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "VIDEOS NOT FOUND")
    }
  //AUTHORIZATION
    if(video?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You cant't update the video as you are not the owner")
    }

    const updateFields = {};
    if(title?.trim()){
        updateFields.title = title.trim();
    }
    if(description?.trim()){
        updateFields.description = description.trim();
    }

    const thumbnailLocalPath = req.file?.path;

    if(thumbnailLocalPath){
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        //console.log("UPLOADED THUMBNAIL:", uploadedThumbnail);


        if(!uploadedThumbnail?.secure_url){
            throw new ApiError(500, "THUMBNAIL UPLOADED FAILED");
        }

         if (video.thumbnail?.public_id) {
            //console.log("OLD THUMBNAIL PUBLIC ID:", video.thumbnail.public_id);

           const oldThumbnailDeleted = await deleteOnCloudinary(video.thumbnail.public_id);

             //console.log("OLD THUMBNAIL DELETE RESPONSE", oldThumbnailDeleted);

        if (!oldThumbnailDeleted || oldThumbnailDeleted.result !== "ok") {
            await deleteOnCloudinary(uploadedThumbnail.public_id);

            throw new ApiError(
                500,
                "OLD THUMBNAIL DELETION FAILED"
            );
        }
      }
        updateFields.thumbnail = {
            url: uploadedThumbnail.secure_url,
            public_id: uploadedThumbnail.public_id
       };
    }

     //if no fields are given 
    if(Object.keys(updateFields).length === 0){
        throw new ApiError(400, "Atleast one field is required to update")
    }

    const newUpdateVideo = await Video.findByIdAndUpdate(
        videoId, {
            $set: updateFields
        },
        {new: true}
    );
    if(!newUpdateVideo){
        throw new ApiError(500, "VIDEO IS NOT UPDATED")
    }
     
    return res
    .status(200)
    .json(new ApiResponse(200, newUpdateVideo, "VIDEO UPDATED SUCCESSFULLY"))

});

//delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const{videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "INVALID VIDEO ID")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "VIDEOS NOT FOUND")
    }
  //AUTHORIZATION
    if(video?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You cant't delete the video as you are not the owner")
    }

    const thumbnailDeleted = await deleteOnCloudinary(video.thumbnail.public_id);
    console.log("THUMBNAIL DELETE RESPONSE:", thumbnailDeleted);

    if (!thumbnailDeleted  || thumbnailDeleted.result !== "ok" && thumbnailDeleted.result !== "not found") {
    throw new ApiError(500, "Thumbnail deletion failed");
    }

    const videoDeletedFromCloudinary = await deleteOnCloudinary(video.videoFile.public_id, "video");
    console.log("VIDEO DELETE RESPONSE:", videoDeletedFromCloudinary);

    if (!videoDeletedFromCloudinary  || videoDeletedFromCloudinary.result !== "ok" && videoDeletedFromCloudinary.result !== "not found") {
    throw new ApiError(500, "Video deletion failed");
    } 

    await Like.deleteMany({
        video: videoId
    })

     await Comment.deleteMany({
        video: videoId
    })

    const videoDeleted = await Video.findByIdAndDelete(videoId);
    if(!videoDeleted){
        throw new ApiError(400, "Failed to delete a video please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "VIDEO DELETED SUCCESSFULLY"));
})

 //toggle publish status of a video
const toggleStatus = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(404, "INVALID VIDEO ID")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "VIDEOS NOT FOUND")
    }
  //AUTHORIZATION
    if(video?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400, "You cant't toggle the public status as you are not the owner")
    }

     //BUSINESS LOGIC
    const toggleVideoPublished = await Video.findByIdAndUpdate(
        videoId, {
            $set: {
                isPublished: !video?.isPublished
            }
        },
        {new: true}
    );

    if(!toggleVideoPublished){
        throw new ApiError(500, "FAILED TO TOGGLE THE VIDEO")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        {isPublished: toggleVideoPublished.isPublished},
        "Video publish toggle successfully"
    ))
});

export {getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo, toggleStatus}
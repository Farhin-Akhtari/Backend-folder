import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Like } from "../models/like.models.js"
import { Playlist } from "../models/playlist.models.js";

//create playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

    if(!name?.trim() || !description?.trim()){
        throw new ApiError(400, "Playlist name and description is required")
    }

const playlist = await Playlist.create({
    name: name.trim(),
    description: description?.trim() || "",
    owner: req.user._id
});

if (!playlist) {
    throw new ApiError(500, "FAILED TO CREATE PLAYLIST");
}

return res
.status(201)
.json(new ApiResponse(201, playlist, "PLAYLIST CREATED SUCCESSFULLY"))

})

//get user playlist
const getUserPlaylist = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID")
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "USER NOT FOUND")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $addFields: {
                videoCount: {
                    $size: {
                        $ifNull: ["$videos", []]
                    }
                }
            }
        },
        {
           $project: {
                name: 1,
                description: 1,
                videoCount: 1,
                createdAt: 1
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "PLAYLIST FETCHED SUCCESFULLY"))

})

//get playlist by id
const getPlaylistById = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "INVALID PLAYLIST ID")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videoDetails",
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
                            owner: 1
                        }
                    },
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "playlistOwner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            "avatar.url": 1
                        }
                    },
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$playlistOwner"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                owner: 1,
                videoDetails: 1,
                createdAt: 1
            }
        }

    ])

     if(!playlist.length === 0){
        throw new ApiError(404, "PLAYLIST NOT FOUND")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "PLAYLIST FETCHED SUCCESSFULLY"))

})

//add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "INVALID PLAYLIST ID")
    }

    const playlist = await Playlist.findById(playlistId)
     if(!playlist){
        throw new ApiError(404, "PLAYLIST NOT FOUND")
    }

    const {videoId} = req.params;
    
        if(!isValidObjectId(videoId)){
            throw new ApiError(400, "INVALID VIDEO ID")
        }

    const video = await Video.findById(videoId);
        
        if(!video){
                throw new ApiError(404, "VIDEO NOT FOUND")
        }

     if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "YOU ARE NOT AUTHORIZED TO ADD VIDEO TO THIS PLAYLIST");
     }

     const existPlaylist = playlist.videos.some(
        (id) => id.toString() === videoId
     )

     if(existPlaylist){
        throw new ApiError(400, "VIDEO ALREADY EXISTS IN PLAYLIST");
     }

     const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlistId, {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
     );

     return res
     .status(200)
     .json(new ApiResponse(200, updatePlaylist, "VIDEO ADDED TO PLAYLIST SUCCESSFULLY"));

})

//remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "INVALID PLAYLIST ID")
    }

    const playlist = await Playlist.findById(playlistId)
     if(!playlist){
        throw new ApiError(404, "PLAYLIST NOT FOUND")
    }

    const {videoId} = req.params;
    
        if(!isValidObjectId(videoId)){
            throw new ApiError(400, "INVALID VIDEO ID")
        }

    const video = await Video.findById(videoId);
        
        if(!video){
             throw new ApiError(404, "VIDEO NOT FOUND")
        }

     if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "YOU ARE NOT AUTHORIZED TO REMOVE VIDEO FROM THIS PLAYLIST");
     }

     const existPlaylist = playlist.videos.some(
        (id) => id.toString() === videoId
     )

     if(!existPlaylist){
        throw new ApiError(400, "VIDEO NOT FOUND IN PLAYLIST");
     }

     const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
            $pull: {
                videos: videoId
            }
          },
            {
               new: true
            }
        )

     return res
     .status(200)
     .json(new ApiResponse(200, updatedPlaylist, "VIDEO REMOVED FROM PLAYLIST SUCCESSFULLY"))

})

//update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "INVALID PLAYLIST ID")
    }

    const {name, description} = req.body;

    const playlist = await Playlist.findById(playlistId).select("owner");

    if(!playlist){
        throw new ApiError(404, "PLAYLIST NOT FOUND")
    }
  //AUTHORIZATION
    if(playlist?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You cant't update the playlist as you are not the owner")
    }

     const updateFields = {};

    if (name !== undefined) {
        if (!name.trim()) {
            throw new ApiError(400, "PLAYLIST NAME CANNOT BE EMPTY");
        }

        updateFields.name = name.trim();
    }

    if (description !== undefined) {
        if (!description.trim()) {
            throw new ApiError(400, "DESCRIPTION CANNOT BE EMPTY");
        }

        updateFields.description = description.trim();
    }
    
    //if no fields are given 
    if(Object.keys(updateFields).length === 0){
        throw new ApiError(400, "Atleast one field is required to update")
    }

    const newUpdatePlaylist = await Playlist.findByIdAndUpdate(
        playlistId, {
            $set: updateFields
        },
        {new: true}
    );
    if(!newUpdatePlaylist){
        throw new ApiError(500, "PLAYLIST IS NOT UPDATED")
    }
     
    return res
    .status(200)
    .json(new ApiResponse(200, newUpdatePlaylist, "PLAYLIST UPDATED SUCCESSFULLY"))

})

//delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
     const {playlistId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "INVALID PLAYLIST ID")
    }

    const playlist = await Playlist.findById(playlistId).select("owner");

    if(!playlist){
        throw new ApiError(404, "PLAYLIST NOT FOUND")
    }

    //AUTHORIZATION
    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "YOU ARE NOT AUTHORIZED TO DELETE THIS PLAYLIST")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    if(!deletedPlaylist){
        throw new ApiError(404, "PLAYLIST NOT FOUND")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "PLAYLIST DELETED SUCCESSFULLY"))

})

export {createPlaylist, getUserPlaylist, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist ,updatePlaylist, deletePlaylist}
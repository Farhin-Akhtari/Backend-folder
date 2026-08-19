import { isValidObjectId } from "mongoose";
import { SearchHistory } from "../models/searchHistory.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from  "../utils/asyncHandler.js"

//ADD SEARCH HISTORY
const addSearchHistory = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  const cleanedQuery = query.trim();

  const existingSearch = await SearchHistory.findOne({
    user: req.user._id,
    query: cleanedQuery,
  });

  if (existingSearch) {
    existingSearch.createdAt = new Date();
    await existingSearch.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingSearch,
          "SEARCH HISTORY UPDATED SUCCESSFULLY"
        )
      );
  }

  const search = await SearchHistory.create({
    user: req.user._id,
    query: cleanedQuery,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      search,
      "SEARCH HISTORY ADDED SUCCESSFULLY"
    )
  );
});

// get search history
const getSearchHistory = asyncHandler(async (req, res) => {
  const searchHistory = await SearchHistory.find(
   { user: req.user._id}
  ).sort({createdAt: -1});

  return res
  .status(200)
  .json(new ApiResponse (200, searchHistory, "Search History fetched successfully"))

})

//delete search history
const deleteSearchHistory = asyncHandler(async (req, res) => {
  const {searchHistoryId} = req.params
  
  if (!isValidObjectId(searchHistoryId)) {
    throw new ApiError(400, "INVALID SEARCH ID");
  }

  const deleteSearch = await SearchHistory.findOneAndDelete({
     user: req.user._id,
    _id: searchHistoryId
  })
  
  if(!deleteSearch){
    throw new ApiError(404, "Failed to delete search history")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "SEARCH HISTORY DELETED SUCCESSFULLY"))

})

// clear search history
const clearSearchHistory = asyncHandler(async (req, res) => {
  const clearHistory = await SearchHistory.deleteMany({
    user: req.user._id
  })


 return res
 .status(200)
 .json(new ApiResponse (200, {}, "CLEAR SEARCH HISTORY SUCCESSFULLY"))

})

export {addSearchHistory, getSearchHistory, deleteSearchHistory, clearSearchHistory}
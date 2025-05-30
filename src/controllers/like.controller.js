import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {Like} from "../models/like.model.js"
import mongoose from "mongoose"

const likeOnComment = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const likeOnVideo = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const likeOnTweet = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const getLikedVideos = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const yourController = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})


export { likeOnComment,likeOnVideo,likeOnTweet,getLikedVideos }
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {Tweet} from "../models/tweet.model.js"
import mongoose from "mongoose"

const addTweet = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const editTweet = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const deleteTweet = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const getYourTweet = asyncHandler(async(req,res)=>{
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

export { addTweet,editTweet,deleteTweet,getYourTweet }
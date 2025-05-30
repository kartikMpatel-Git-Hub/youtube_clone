import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import mongoose from "mongoose"

const addComment = asyncHandler(async(req,res)=>{
    try {
        // const {videoId} = req.params.videoId
        // const {}
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const editComment = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const deleteComment = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const getVideoComments = asyncHandler(async(req,res)=>{
    try {
        const {videoId} = req.params.videoId
        const {page = 1 , limit = 10} = req.query


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

export { addComment,editComment,deleteComment,getVideoComments}
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {PlayList} from "../models/playlist.model.js"
import mongoose from "mongoose"

const createPlayList = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const addVideo = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const changeDescription = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const changeTitle = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const removeVideo = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const getMyAllPlayList = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const getPlayList = asyncHandler(async(req,res)=>{
    try {
        return res.status(200).json(new ApiResponse(200,{},"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const deletePlayList = asyncHandler(async(req,res)=>{
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

export { createPlayList,addVideo,changeDescription,changeTitle,removeVideo,getMyAllPlayList,getPlayList,deletePlayList }
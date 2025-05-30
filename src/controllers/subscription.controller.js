import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js"
import mongoose from "mongoose"
import { changeUserEmail } from "./user.controller.js"

const toggleSubscribe = asyncHandler(async(req,res)=>{
    try {
        let channelId = req.params.channelId
        const channel = await User.findById(channelId)
        if(!channel)
            return res.status(200).json(new ApiError(200,"Channel Not Found !!"))
        const isSubscribed = await Subscription.findOne({
            subscriber: req.user?._id,
            channel: channelId
        })
        if(!isSubscribed){
            const result = await Subscription.create({
                subscriber : req.user?._id,
                channel : channelId
            })
            return res.status(200).json(new ApiResponse(200,result,"Subscribed !!"))
        }
        else{
            const result = await Subscription.findOneAndDelete({
                subscriber: req.user?._id,
                channel: channelId
            })
            return res.status(200).json(new ApiResponse(200,result,"Unsubscribed !!"))
        }
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While Subscribing!!"))
    }
})//

const getMySubscribers = asyncHandler(async(req,res)=>{
    try {
        // console.log()
        const subscribersList = await User.aggregate([
            {
                $match : {
                    _id : req.user?._id
                }
            },
            {
                $lookup :{
                    from : "subscriptions",
                    localField : "_id",
                    foreignField : "channel",
                    as : "subscribers",
                    pipeline : [
                        {
                            $lookup : {
                                from : "users",
                                localField : "subscriber",
                                foreignField : "_id",
                                as : "subscriber",
                                pipeline : [
                                    {
                                        $project : {
                                            userName : 1,
                                            fullName : 1,
                                            avatar : 1,                                            
                                        },
                                    },
                                ]
                            },
                        },
                        {
                            $project : {
                                _id : 0,
                                subscriber : 1,
                            }
                        },
                        {
                            $addFields: {
                                subscriber :{
                                    $first : "$subscriber"
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project : {
                    userName : 1,
                    subscribers : 1,
                }
            }
        ]) 
        if(!subscribersList?.length)
            res.status(401).json(new ApiError(401,"Chennel Not Found !!"))

        return res.status(200).json(new ApiResponse(200,subscribersList[0],"Subscribers Id"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const getSubscribers = asyncHandler(async(req,res)=>{
    try {
        let channelId = req.params.channelId
        const channel = await User.findById(channelId)
        if(!channel)
            return res.status(200).json(new ApiError(200,"Channel Not Found !!"))
        const subscribersList = await User.aggregate([
            {
                $match : {
                    _id : new mongoose.Types.ObjectId(channelId)
                },
            },
            {
                $lookup : {
                    from : "subscriptions",
                    localField : "_id",
                    foreignField : "channel",
                    as : "subscribers",
                    pipeline : [
                        {
                            $lookup : {
                                from : "users",
                                localField : "subscriber",
                                foreignField : "_id",
                                as : "subscriber",
                                pipeline : [
                                    {
                                        $project : {
                                            userName : 1,
                                            email : 1,
                                            fullName : 1,
                                            avatar : 1,
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            $project : {
                                _id : 0,
                                subscriber : 1
                            }
                        },
                        {
                            $addFields : {
                                subscriber : {
                                    $first : "$subscriber"
                                }
                            }
                        }
                    ]
                }    
            },
            {
                $project : {
                    userName : 1,
                    email : 1,
                    fullName : 1,
                    avatar : 1,
                    coverImage : 1,
                    subscribers : 1
                }
            }
        ])
        if(!subscribersList?.length)
            res.status(401).json(new ApiError(401,"Chennel Not Found !!"))

        return res.status(200).json(new ApiResponse(200,subscribersList[0],"<Message>"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While..!!"))
    }
})

const getSubscribed = asyncHandler(async(req,res)=>{
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

export { toggleSubscribe,getSubscribed,getMySubscribers,getSubscribers}
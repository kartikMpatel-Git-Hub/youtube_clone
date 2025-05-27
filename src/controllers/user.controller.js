import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloud,removeImage} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const gerenateAccessAndRefereshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false}) //it will Save Without Validatting Again

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something Went Wrong While Generating Tokens..")
    }
}

const registerUser = asyncHandler( async (req,res) =>{
    // res.status(200).json({
    //     message : "Ok",
    //     name : "Kartik"
    // })

    if(!req.body || Object.keys(req.body).length != 4)
        return res.status(400).json(new ApiError(400,"All Field Is Required!!"))
    let {fullName,email,userName,password} = req.body
    // console.log(req.body)
    // console.log(req.files)
    if(
        [fullName,email,userName,password].some((field)=>field?.trim() === "")
    ){
        return res.status(400).json(new ApiError(400,"All Is Required !!"));
    }
    const existingUser = await User.findOne({
        $or : [{ userName }, { email }]
    });
    if (existingUser) {
        return res.status(409).json(new ApiError(409, "User Already Exists With Email Or Username"));
    }
    let AvatarLocalPath;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
        coverImageLocalPath = req.files.coverImage[0].path
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0)
        AvatarLocalPath = req.files.avatar[0].path
    else    
        return res.status(400).json(new ApiError(400,"Avatar File Is Required !!"));

    const avatar = await uploadOnCloud(AvatarLocalPath)
    const coverImage = await uploadOnCloud(coverImageLocalPath)
    
    // console.log(avatar)
    
    if(!avatar){
        return res.status(401).json(new ApiError(401,"Avatar File Is Required !!"));
    }
    
    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : avatar?.url || "",
        email,
        password,
        userName:userName.toLowerCase() 
    })
    
    // console.log(user)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        return res.status(500).json(new ApiError(500,"Something Went Wrong While Registering.."));
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Created !")
    )
})

const loginUser = asyncHandler(async (req,res)=>{
    /**
     * 1.Get Details From User Like Userid And Password 
     * 2.check is Anyfield Is Empty Or Not if Empty Then Give Error 
     * 3.if Both field are fill Then get data from data base based on username
     * 4.if not userexist then give error usernot found 
     * 5.aftre getting data compare password with password which given 
     *      (Because it encryted we have to check in thier way)
     * 6.if password is right generate access and referesh token and send cookies 
     *      then login msg else error message 
     */

    // if(!req.body || 1 < Object.keys(req.body).length < 4)
    //     return res.status(400).json(new ApiError(400,"All Field Is Required!!"))
    let {email,userName,password} = req.body
    if(!email && !userName){
        res.status(400).json(new ApiError(400,"Username Or Email Required !!"))
    }
    if(!password){
        res.status(400).json(new ApiError(400,"Enter Password First !!"))
    }
    // if(email){
        
    // }else{
        
    // }
    const user = await User.findOne({
        $or :[{userName},{email}] //check either anyof then is Exist based on it 
    })

    if(!user)
        res.status(404).json(new ApiError(404,"User Does Not Exist !!"))

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid)
        res.status(401).json(new ApiError(401,"Invalid Password !!"))

    const {accessToken,refreshToken} = await gerenateAccessAndRefereshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    //Sending Cookies
    const options = {
        HttpOnly : true,
        secure : true

        // By Default It is false So anyone from Frontend can modify but if 
        // it is true  then only edit by servers (Visible But Not modify by frontend)
        
    }
    return res.status(200)
                .cookie("accessToken",accessToken,options)
                .cookie("refreshToken",refreshToken,options)
                .json(new ApiResponse(200,
                    {
                        user : loggedInUser,accessToken,refreshToken
                    },
                    "User Logged In Succesfuly"
                ))
})

const logOutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },{
            new : true
        }
    )
    const options = {
        HttpOnly : true,
        secure : true
    }
    return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(new ApiResponse(200,{},"User Logged Out.."))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    // console.log(req.cookies.refreshToken)
    if(!req.cookies?.refreshToken && !req.body?.refreshToken)
        res.status(401).json(new ApiError(401,"Please Logged In!"))
        
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken // If Mobile User
    if(!incomingToken){
        res.status(401).json(new ApiError(401,"Unauthorized Access !"))
    }
    
    try {
        const decodedToken = jwt.verify(incomingToken,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user)
            res.status(401).json(new ApiError(401,"Invalid Token!"))
    
        if(incomingToken !== user.refreshToken)
            res.status(401).json(new ApiError(401,"Token Is Expire Or Used!"))
        
        const {accessToken,refreshToken : newRefreshToken} = await gerenateAccessAndRefereshToken(user._id)
        // console.log(`new Token : ${newRefreshToken}`)
        const options = {
            HttpOnly : true,
            secure : true
        }
        
        res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new ApiResponse(200,
            {
                accessToken,
                refreshToken : newRefreshToken
            },"Token Refresed !!"
        ))
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Generating new Token!"))
    }
})

const changeUserPassword = asyncHandler(async (req,res) => {
    try {
        const {oldPassword,newPassword} = req.body
        const user = await User.findById(req.user?._id)
        
        if(!oldPassword || !newPassword)
            res.status(401).json(new ApiError(401,"All Field Is Required!!"))

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
        if(!isPasswordCorrect)
            res.status(401).json(new ApiError(401,"Invalid Old Password !!"))
    
        user.password = newPassword
        await user.save({validateBeforeSave : false})
        res.status(200).json(new ApiResponse(200,{},"Password Change Succesfuly !"))
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Changing Password !!"))
    }

})
//Why This is Different Then password Because in password we put one hook which encryp our password 
//but in other frield we don't need that's why
const changeUserEmail = asyncHandler(async(req,res)=>{
    try {
        const {email} = req.body
        
        if(!email)
            res.status(401).json(new ApiError(401,"email Is Required!!"))

        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set : {
                    email
                } 
            },
            {new : true}
            // This Help When We want to return the object which changed or after update
        ).select("-password")
        res.status(200).json(new ApiResponse(200,user,"Email Updated Succesfully !!"))
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Changing Email !!"+error))
    }
})

const changeUserUserName = asyncHandler(async(req,res)=>{
    try {
        const {userName} = req.body
        // console.log(userName)
        if(!userName)
            res.status(401).json(new ApiError(401,"userName Is Required!!"))

        // if(User.findOne(userName)){
        //     res.status(401).json(new ApiError(401,"UserName Already Exist !!"))
        // }
        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set : {
                    userName
                } 
            },
            {new : true}
            // This Help When We want to return the object which changed or after update
        ).select("-password")
        console.log(user)
        res.status(200).json(new ApiResponse(200,user,"userName Updated Succesfully !!"))
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Changing userName !!"+error.message))
    }
})

const changeUserFullName = asyncHandler(async(req,res)=>{
    try {
        const {fullName} = req.body
        // console.log(userName)
        if(!fullName)
            res.status(401).json(new ApiError(401,"fullName Is Required!!"))
        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set : {
                    fullName
                } 
            },
            {new : true}
            // This Help When We want to return the object which changed or after update
        ).select("-password")
        console.log(user)
        res.status(200).json(new ApiResponse(200,user,"fullName Updated Succesfully !!"))
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Changing fullName !!"+error.message))
    }
})


/**create utility for delete image from cloud */
const changeUserAvatar = asyncHandler(async (req,res)=>{
    try {
        const localFilePath = req.file?.path
        if(!localFilePath)
            res.status(401).json(new ApiError(401,"File Not Found !"))
        const avatar = await uploadOnCloud(localFilePath)
        if(!avatar.url){
            res.status(401).json(new ApiError(401,"Error While Uploading File !"))
        }
        const user = await User.findById(req.user?._id).select("-password -refreshToken")
        const oldImage = user.avatar
        user.avatar = avatar.url
        await user.save({validateBeforeSave : false})
        let cloudFileName = oldImage.split('/')
        cloudFileName = cloudFileName[cloudFileName.length-1].split('.')[0]
        const response = await removeImage(cloudFileName)  
        if(!response){
            res.status(401).json(new ApiError(401,"Something Wrong While Deleting",error.message))
        }
        res.status(200).json(new ApiResponse(200,user,"New avatar Updated Succesfully !!"))
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Changing Avatar !!"))
    }
})

const changeUserCoverImage = asyncHandler(async (req,res)=>{
    try {
        const localFilePath = req.file?.path
        if(!localFilePath)
            res.status(401).json(new ApiError(401,"File Not Found !"))
        const coverImage = await uploadOnCloud(localFilePath)
        if(!coverImage.url){
            res.status(401).json(new ApiError(401,"Error While Uploading File !"))
        }
        const user = await User.findById(req.user?._id).select("-password -refreshToken")
        const oldImage = user.coverImage
        user.coverImage = coverImage.url
        await user.save({validateBeforeSave : false})
        let cloudFileName = oldImage.split('/')
        cloudFileName = cloudFileName[cloudFileName.length-1].split('.')[0]
        const response = await removeImage(cloudFileName)  
        if(!response){
            res.status(401).json(new ApiError(401,"Something Wrong While Deleting",error.message))
        }
        res.status(200).json(new ApiResponse(200,user,"coverImage Updated Succesfully !!"))
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Changing coverImage !!",error.message))
    }
})

const getCurrentUser = asyncHandler(async (req,res)=>{
    return res.status(200).json(200,req.user,"Current User Fetched !")
})

const getUserChannelProfile = asyncHandler(async (req,res)=>{
    try {
        const userName = req.query.userName
        console.log(userName)
        if(!userName?.trim())
            res.status(401).json(new ApiError(401,"userName Not Found !!"))

        const channel = await User.aggregate([
            {
                $match:{ 
                    userName : userName?.toLowerCase()
                }
                //Just Like Where Conditions
            },
            {
                $lookup : { // same as left join or subquery with some simmiler fields
                    from : "subscriptions", // from which table 
                    localField : "_id", // compare field from current table
                    foreignField : "channel", // simmiler field of other table
                    as : "subscribers" // name of new firld
                }
            },
            {
                $lookup : { // same as left join or subquery with some simmiler fields
                    from : "subscriptions", // from which table 
                    localField : "_id", // compare field from current table
                    foreignField : "subscriber", // simmiler field of other table
                    as : "subscribed" // name of new firld
                }
            },
            {
                $addFields : { //it will add new field in table 
                    subscribersCount : {
                        $size : "$subscribers" // total recoard / documents selected
                    },
                    subscribedCount : {
                        $size : "$subscribed" // total recoard / documents selected
                    },
                    isSubscribed : {
                        $cond : { // // For Condition
                            if : {$in :[req.user?._id,"$subscribers.subscriber"]}, // if for condition
                            //in for check is field exist on selected document
                            then : true, // condition true
                            else : false // conditions false
                        }
                    }
                }
            },
            {
                // selecting only those field which requires
                $project : {
                    fullName : 1,
                    userName : 1,
                    subscribersCount : 1,
                    subscribedCount : 1,
                    isSubscribed : 1,
                    avatar : 1,
                    coverImage : 1,
                    email : 1
                }
            }
        ])
        if(!channel?.length)
            res.status(401).json(new ApiError(401,"Chennel Not Found !!"))

        return res.status(200).json(new ApiResponse(200,channel[0],"Chennel Data !!"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While Getting Data !!"))
    }
})

const getWatchHistory = asyncHandler(async(req,res)=>{
    try {
        const user = await User.aggregate([
            {
                $match : {
                    /**because mongoose not work here we have to explicitly convert string into object id
                        the req.user._id give us string and mongoose convert into mongodb object id but it won't
                         work here so we have to do it by own */
                    _id : new mongoose.Types.ObjectId(req.user._id),//deplricated
                    // _id : new mongoose.Types.ObjectId("0",repeat(req.user._id)),
                },
            },
            {
                /**It Will Select All Video data from the video table */
                $lookup : { 
                    from : "videos",
                    localField : "watchHistory",
                    foreignField : "_id",
                    as : "watchHistory",
                    /**Now We Have Data In form of id but we need owner data from video table 
                     * because it only return the id so we have to get all data 
                     */
                    pipeline : [
                        {
                            /**
                             * it will help to get data again from user table 
                             * and filter the data like name and avatar 
                             */
                            $lookup : {
                                from : "users",
                                localField : "owner",
                                foreignField : "_id",
                                as : "owner",
                                pipeline : [
                                    {
                                        $project : {
                                            fullName : 1,
                                            userName : 1,
                                            avatar : 1
                                        }
                                    }
                                ]
                            }
                        },
                        /**
                         * it will add extra field owner in form of array but for easy way 
                         * we have to convert it into simple field 
                         */
                        {
                            $addFields : {
                                owner : {
                                    $first : "$owner" //first index data so simple with first
                                }
                            }
                        }
                    ]
                }
            }
        ])
        console.log(user)
        return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"Chennel Data !!"))
    } catch (error) {
        return res.status(401).json(new ApiError(401,"Something Went Wrong While Getting Data !!"))
    }
})

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeUserFullName,
    changeUserPassword,
    getCurrentUser,
    changeUserEmail,
    changeUserUserName,
    changeUserAvatar,
    changeUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}
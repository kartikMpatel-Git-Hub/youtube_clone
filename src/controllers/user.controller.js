import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloud} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"

const registerUser = asyncHandler( async (req,res) =>{
    // res.status(200).json({
    //     message : "Ok",
    //     name : "Kartik"
    // })
    const {fullName,email,userName,password} = req.body
    
    if(
        [fullName,email,userName,password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400,"All Is Required !!")
    }
    if(User.findOne({
        $or : [{ userName },{ email }]
    })){
        throw new ApiError(409,"User Already Exist With Email Or Username")
    }
    console.log("FIle : ",req.files)
    const AvatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!AvatarLocalPath){
        throw new ApiError(400,"Avatar File Is Required !!")
    }

    const avatar = await uploadOnCloud(AvatarLocalPath)
    const coverImage = await uploadOnCloud(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar File Is Required !!")
    }

    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : avatar?.url || "",
        email,
        password,
        userName:userName.toLowerCase() 
    })

    const createdUser = await User.findById(user.__id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something Went Wrong While Registering..")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Created !")
    )
})

export {registerUser}
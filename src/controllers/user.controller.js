import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloud} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { compareSync } from "bcrypt"

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

export {registerUser}
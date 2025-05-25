import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloud} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

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
export {registerUser,loginUser,logOutUser,refreshAccessToken}
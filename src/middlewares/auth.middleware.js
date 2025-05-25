import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
export const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") //Also Use Substring to cut it down
        
        if(!token)
            res.status(401).json(new ApiError(401,"Unauthorized Token !!"))
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user)
            res.status(401).json(new ApiError(401,"Invalid Token !!"))
    
        req.user = user
        next()
    } catch (error) {
        res.status(401).json(new ApiError(401,"Something Went Wrong While Token Verification !!"))
    }
})

export {verifyJWT}
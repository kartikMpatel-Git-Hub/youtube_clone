import { Router } from "express"
import {loginUser, logOutUser, registerUser,refreshAccessToken, changeUserPassword, changeUserUserName, changeUserEmail, changeUserAvatar, changeUserCoverImage, changeUserFullName, getUserChannelProfile, getWatchHistory, getCurrentUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount:1
        },
        {
            name : "coverImage",
            maxCount:1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
//Secure Routes

//logout
router.route("/logout").post(verifyJWT,logOutUser)

//refreshToken
router.route("/newRefreshToken").post(refreshAccessToken)

//change Password
router.route("/changePassword").post(verifyJWT,changeUserPassword)

//change userName
router.route("/changeFullName").post(verifyJWT,changeUserFullName)

//change userName
router.route("/changeUserName").post(verifyJWT,changeUserUserName)

//change email
router.route("/changeEmail").post(verifyJWT,changeUserEmail)

//change Avatar
router.route("/changeAvatar").post(upload.single("avatar"),verifyJWT,changeUserAvatar)

//change coverImage
router.route("/changeCoverImage").post(upload.single("coverImage"),verifyJWT,changeUserCoverImage)

//get current user data
router.route("/getUserData").post(verifyJWT,getCurrentUser)

//get Channel Page data
router.route("/getChannelProfile").post(verifyJWT,getUserChannelProfile)

//get Watch History data
router.route("/getWatchHistory").post(verifyJWT,getWatchHistory)

export default router
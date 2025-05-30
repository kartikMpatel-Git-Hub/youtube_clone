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
router.route("/changeAvatar").post(verifyJWT,upload.single("avatar"),changeUserAvatar)

//change coverImage
router.route("/changeCoverImage").post(verifyJWT,upload.single("coverImage"),changeUserCoverImage)

//get current user data
router.route("/getUserData").get(verifyJWT,getCurrentUser)

//get Channel Page data
router.route("/getChannelProfile/:userName").get(verifyJWT,getUserChannelProfile)

//get Watch History data
router.route("/getWatchHistory").get(verifyJWT,getWatchHistory)

export default router
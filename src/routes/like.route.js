import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { likeOnComment,likeOnVideo,likeOnTweet,getLikedVideos } from "../controllers/like.controller.js"
const router = Router()

router.use(verifyJWT)

router.route("/video/:videoId").post(likeOnVideo)
router.route("/tweet/:tweetId").post(likeOnTweet)
router.route("/comment/:commentId").post(likeOnComment)
router.route("/getLikedVideo").post(getLikedVideos)

export default router
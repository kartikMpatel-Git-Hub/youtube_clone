import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { addTweet,editTweet,deleteTweet,getYourTweet } from "../controllers/tweet.controller.js"
const router = Router()

router.use(verifyJWT)

router.route("/").post(addTweet)
router.route("/getTweet/:userId").post(getYourTweet)
router.route("/updateTweet/:tweetId").post(editTweet)
router.route("/deleteTweet/:tweetId").post(deleteTweet)

export default router
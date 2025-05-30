import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {toggleSubscribe,getSubscribed,getSubscribers} from "../controllers/subscription.controller.js"
const router = Router()

router.use(verifyJWT)

router.route("/toggleSubscribe/:channelId").get(toggleSubscribe)
router.route("/getSubscribers/:channelId").get(getSubscribers)
router.route("/getSubscribed/:userId").get(getSubscribed)

export default router
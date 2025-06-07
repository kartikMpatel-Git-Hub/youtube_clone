import { Router } from "express"
import {addComment,editComment,deleteComment,getVideoComments} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/addComment/:videoId").post(addComment)

router.route("/getComments/:videoId").get(getVideoComments)

router.route("/removeComment/:commentId").delete(deleteComment)

router.route("/updateComment/:commentId").patch(editComment)
export default router
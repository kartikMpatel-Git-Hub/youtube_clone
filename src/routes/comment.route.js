import { Router } from "express"
import {addComment,editComment,deleteComment,getVideoComments} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/:videoId").get(getVideoComments).post(addComment)
router.route("/delete/:commentId").delete(deleteComment)
router.route("/update/:commentId").post(editComment)
export default router
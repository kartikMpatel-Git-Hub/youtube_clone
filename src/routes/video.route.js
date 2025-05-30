import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import {uploadVideo,removeVideo,changeTitle,changeThumbnail,changeDescription,
    togglePublishStatus ,getAllVideos,getMyVideos,getVideo} from "../controllers/video.controller.js"
const router = Router()

router.use(verifyJWT)

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name :"videoFile",
                maxCount : 1
            },
            {
                name :"thumbnail",
                maxCount : 1
            }
        ]),uploadVideo
    )

router
    .route("/:videoId")
    .get(getVideo)
    .delete(removeVideo)
router.route("/myVideo/getMyVideos").get(getMyVideos)
router.route("/changeThumbnail/:videoId").patch(upload.single("thumbnail"),changeThumbnail)
router.route("/changeTitle/:videoId").patch(changeTitle)
router.route("/changeDescription/:videoId").patch(changeDescription)
router.route("/toggledStatus/:videoId").patch(togglePublishStatus)

export default router
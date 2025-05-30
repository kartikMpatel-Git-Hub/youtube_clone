import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {createPlayList,addVideo,changeDescription,changeTitle,removeVideo,getMyAllPlayList,getPlayList,deletePlayList} from "../controllers/playList.controller.js"
const router = Router()

router.use(verifyJWT)

router.route("/").post(createPlayList)
router.route("/changeTitle/:playListId").get(changeTitle)
router.route("/changeDescription/:playListId").get(changeDescription)
router.route("/addVideo/:videoId/:playListId").get(addVideo)
router.route("/removeVideo/:videoId/:playListId").get(removeVideo)

router.route("/getPlayList/:userId").get(getMyAllPlayList)
router.route("/getMyPlayList/:playListId").get(getPlayList)
export default router
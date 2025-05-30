import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true 
}))

app.use(express.json({limit:process.env.LIMITS}))
app.use(express.urlencoded({extended:true,limit:process.env.LIMITS}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes 
import commentRouter from './routes/comment.route.js'
import likeRouter from './routes/like.route.js'
import playListRouter from './routes/playList.route.js'
import subscriptionRouter from './routes/subscription.route.js'
import tweetRouter from './routes/tweet.route.js'
import userRouter from './routes/user.route.js'
import videoRouter from './routes/video.route.js'
import deshboardRouter from './routes/deshboard.route.js'

app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/playList",playListRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/tweet",tweetRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/deshboard",deshboardRouter)

//http://localhost:4000/api/v1/users/register
export {app}
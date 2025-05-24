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
import userRouter from './routes/user.route.js'

app.use("/api/v1/users",userRouter)

//http://localhost:4000/api/v1/users/register
export {app}
// require ('dotenv').config({path : "./env"})
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config(
    {
        path : "./env"
    }
)

connectDB()


/*import express from "express"

const app = express()

;(async () =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on("error",(error)=>{
            console.log("App is Unable To Work ")
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App Is Runnig On ${process.env.PORT}`)
        })
    } catch (error) {
        console.error(error)
        throw error
    }
})()*/
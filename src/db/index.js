import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB =  async ()=>{
    try {
        const con = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\nMongoDB Connected !! \nHOST : ${con.connection.host}`)
    } catch (error) {
        console.log(`Some Connection Error !! ${error}`)
        process.exit(1)
    }
}

export default connectDB
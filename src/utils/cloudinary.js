import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloud = async (localFile)=>{
    try {
        if(!localFile) return null;
        const response = await cloudinary.uploader.upload(localFile,{
            resource_type : "auto"
        })
        console.log(`FIle Is Uploaded On Cloudinary : ${response}`)
        return response
    } catch (error) {
        fs.unlinkSync(localFile)
        console.log(`Something Error : ${error}`)
        return null
    }
}

export {uploadOnCloud}
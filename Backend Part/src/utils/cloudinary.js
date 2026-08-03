import {v2 as cloudinary} from "cloudinary";
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:  process.env.CLOUDINARY_API_KEY,
        api_secret:  process.env.CLOUDINARY_API_SECRET,
    });


    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) 
              return console.log("NOT FOUND")
            //upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            //file has been uploaded successfully
          //  console.log("FILE IS UPLOADED ON CLOUDINARY", response.url);
          
          fs.unlinkSync(localFilePath)
            return response;

        } catch (error) {
           console.log("Cloudinary upload error:", error);

           if (fs.existsSync(localFilePath)) {
               fs.unlinkSync(localFilePath);
            }

        return null;
        }
    }

 const deleteOnCloudinary = async(public_id, resource_type="image") => {
    try {
        if(!public_id)
            return console.log("PUBLIC ID IS REQUIRED");

        const response = await cloudinary.uploader.destroy(public_id, {
            resource_type
        });
        return response;

    } catch (error) {
        console.log("Delete on cloudinary failed", error);
        return error;
    }

 }

     export {uploadOnCloudinary, deleteOnCloudinary}
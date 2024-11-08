import { User } from "../models/user.model.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  const userId = req.user?.userId;
  const profilePhoto = req.file;

  try {
    if (!profilePhoto) {
      return res.status(400).json({ error: "File not found" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ folder: "profile_images" }, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        })
        .end(profilePhoto.buffer);
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: uploadResult.secure_url },
      { new: true }
    );
    if (!user)
      return res.status(201).json({ status: false, message: "user not found" });
    //   await user.save();
    res
      .status(200)
      .json({ message: "Profile photo uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile photo", error });
  }
};


export const getProfilePhoto = async (req, res) => {
    const userId = req.user?.userId;
    
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        if (!user.profilePhoto) {
            return res.status(404).json({message: "Profile photo not found"})
        }

         const signedUrl = cloudinary.url(user.profilePhoto, {
           type: "authenticated",
           sign_url: true,
           secure: true,
           transformation: { fetch_format: "auto", quality: "auto" },
           expires_at: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes expiration
         });
        res.status(200).json({profilePhoto: signedUrl})
    } catch (error) {
        res.status(500).json({ message: "Error retrieving profile photo", error: error.message });
    }
}

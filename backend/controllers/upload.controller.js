import { User } from "../models/user.model.js";

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  const userId = req.user?.userId;
    const profilePhoto = req.file ? req.file.path : null;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ message: "Profile photo uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile photo", error });
  }
};

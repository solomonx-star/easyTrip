
import { User } from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  const userId = req.user?.userId;
  const { gender, city, country } = req.body;

  try {
    const result = await User.updateMany(
      { _id: userId }, // Use a filter to match documents (by `_id` in this case)
      {
        $set: {
          // firstName,
          // lastName,
          // username,
          // email,
          gender,
          country,
          city,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "Profile updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

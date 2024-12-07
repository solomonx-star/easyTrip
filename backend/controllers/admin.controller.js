import { adminPost } from "../models/adminPost.model.js";
import Booking from "../models/booking.js";
import { User } from "../models/user.model.js";
import cloudinary from "cloudinary";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Get all users
export const getAllUsers = async (req, res) => {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
  try {
    const users = await User.find({role: "customer"}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};



export const postRide = async (req, res) => {
    const { from, to, price, departureDate, departureTime, etaTime, vehicleNo, noOfSeats, availableSeats, vehicleInfo } = req.body;
    // const file = req.file;

  try {
    // Upload to Cloudinary if `pic` is a base64 string
    // if (!file) {
    //   return res.status(400).json({ error: "File not found" });
    // }

    // Upload the image to Cloudinary
    // const uploadResult = cloudinary.v2.uploader
    //   .upload_stream({ folder: "ride_images" }, async (error, result) => {
    //     if (error) {
    //       return res
    //         .status(500)
    //         .json({ error: "Error uploading image", details: error.message });
    //     }

        // Save Cloudinary image URL in your database
        const newAdminPost = new adminPost({
          // pic: result.secure_url,
          from,
          to,
          price,
          departureDate,
          departureTime,
          etaTime,
          vehicleNo,
          noOfSeats,
          availableSeats,
          vehicleInfo
        });

        const postRide = await newAdminPost.save();
        res.status(201).json({
          message: "Ride posted successfully",
          postRide,
        });
      // })
      // .end(file.buffer); // Stream the file buffer to Cloudinary
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error posting ride", details: error.message });
  }
};

export const getAdminPost = async (req, res) => {
  try {
        const posts = await adminPost.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteAdminPost = async (req, res) => {
   try {
        await adminPost.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "customer" });
     res.status(200).json({ count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Failed to retrieve user count" });
  }
} 

export const getBookingCount = async (req, res) => {
  try {
    const bookCount = await Booking.countDocuments();
    res.status(200).json({ count: bookCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Failed to retrieve user count" });
  }
}; 


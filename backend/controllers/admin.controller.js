import { adminPost } from "../models/adminPost.model.js";
import Booking from "../models/booking.js";
import { User } from "../models/user.model.js";
import cloudinary from "cloudinary";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("customer", "name email");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookings", error });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};

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

export const deleteRide = async () => {
    const { id } = req.params;

    try {
        const ride = await adminPost.findByIdAndDelete(id);
        if (!ride) return res.status(404).json({ message: "ride not found" });
        res.status(200).json({message: "ride deleted"})
    } catch (error) {
        res.status();
    }
}


export const postRide = async (req, res) => {
    const { from, to, price } = req.body;
    const file = req.file;

  try {
    // Upload to Cloudinary if `pic` is a base64 string
    if (!file) {
      return res.status(400).json({ error: "File not found" });
    }

    // Upload the image to Cloudinary
    const uploadResult = cloudinary.v2.uploader
      .upload_stream({ folder: "ride_images" }, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Error uploading image", details: error.message });
        }

        // Save Cloudinary image URL in your database
        const newAdminPost = new adminPost({
          pic: result.secure_url,
          from,
          to,
          price,
        });

        const postRide = await newAdminPost.save();
        res.status(200).json({
          message: "Ride posted successfully",
          postRide,
        });
      })
      .end(file.buffer); // Stream the file buffer to Cloudinary
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error posting ride", details: error.message });
  }
};


import { adminPost } from "../models/adminPost.model.js";
import Booking from "../models/booking.js";
import { User } from "../models/user.model.js";

export const getPost = async (req, res) => {
  try {
    const posts = await adminPost.find({ availability: true });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  const userId = req.user; // Assume `req.user` contains the authenticated user's details
  const { id } = req.params;
  // console.log(id, userId.userId);
  try {
    const booking = new Booking({ postId: id, customerId: userId.userId });
    await booking.save();
    return res.status(201).json({
      message: "successfully booked",
      status: 201,
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const ViewCustomerBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.query.customerId,
    }).populate("postId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

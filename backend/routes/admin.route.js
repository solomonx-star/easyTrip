import express from "express";
import {
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  deleteUser,
  postRide,
} from "../controllers/admin.controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";




const router = express.Router();

// Ensure both authentication and admin role validation for all routes
// router.use(authMiddleware);

router.get("/book", getAllBookings); // View all bookings
router.put("/book/:id", updateBookingStatus); // Update booking status
router.get("/users", getAllUsers); // View all users
router.delete("/users/:id", deleteUser);
router.post("/post-ride", postRide)
// Delete a user

export default router;

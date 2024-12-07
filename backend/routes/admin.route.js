import express from "express";
import {
  getAllUsers,
  deleteUser,
  postRide,
  getUserCount,
  getAdminPost,
  deleteAdminPost
} from "../controllers/admin.controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });
import multer from "multer";





const router = express.Router();

// Ensure both authentication and admin role validation for all routes
// router.use(authMiddleware, adminMiddleware);

router.get("/book", getAdminPost); // View all bookings
router.get("/users", getAllUsers); // View all users
router.delete("/users/:id", deleteUser);
router.delete("/post/:id", deleteAdminPost);
router.post("/post-ride", postRide);
router.get("/count", getUserCount);


//  upload.single("pic"),

export default router;

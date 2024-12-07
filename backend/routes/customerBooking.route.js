import express from "express";
const router = express.Router();

import authMiddleware from "../Middleware/authMiddleware.js";
import { createBooking, getPost, ViewCustomerBooking } from "../controllers/customer.controller.js";


router.post("/book/:id", authMiddleware, createBooking);
router.get("/posts", authMiddleware, getPost);
router.get("/bookings", authMiddleware, ViewCustomerBooking);

export default router;

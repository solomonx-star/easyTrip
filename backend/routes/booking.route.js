
import express from "express";
const router = express.Router();

import authMiddleware from "../Middleware/authMiddleware.js"
import {createBooking} from "../controllers/booking.controller.js"

router.post("/book", authMiddleware, createBooking);

export default router;

import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { updateProfile } from "../controllers/updateProfile.controller.js";

const router = express.Router();

router.post("/profile-update", authMiddleware, updateProfile);

export default router;

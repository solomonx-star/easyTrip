import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { updateProfile } from "../controllers/updateProfile.controller.js";
import { getProfilePhoto } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/profile-update", authMiddleware, updateProfile);
router.get("/profile-picture", authMiddleware, getProfilePhoto);

export default router;

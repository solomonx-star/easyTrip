import express from "express";
import upload from "../Middleware/uploadMiddleware.js";
import { uploadProfilePhoto } from "../controllers/upload.controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/profile-photo",
  authMiddleware,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

export default router;

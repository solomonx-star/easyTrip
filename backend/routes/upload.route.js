import express from "express";
import { getProfilePhoto, uploadProfilePhoto } from "../controllers/upload.controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import multer from "multer";



const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/profile-photo",
  authMiddleware,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);



export default router;

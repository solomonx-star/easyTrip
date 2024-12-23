import express from "express";
import {
  signup,
  login,
  logout,
  getAllRides,
  checkAuth,
  getUser,
} from "../controllers/auth.controller.js";
import { adminSignup } from "../controllers/auth.controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/adminSignup", authMiddleware, adminMiddleware);
router.get("/user-ride", getAllRides);
router.post("/authenticate", authMiddleware, checkAuth);
router.get("/getUser/:userId", authMiddleware, getUser);

export default router;

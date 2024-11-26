import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { generateTokenAndSetCookie } from "../utils/generateTokentAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { adminPost } from "../models/adminPost.model.js";

export const adminSignup = async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  try {
    if (!email || !password || !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ phoneNumber });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Creating a new user with the role of "admin"
    const user = new User({
      email,
      password: hashedPassword,
      phoneNumber,
      role: "admin",
      isVerified: true, // Assuming no email verification is needed
    });

    await user.save();

    // Generate JWT and set it in a cookie
    const token = generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: {
        token: token, // Return token for convenience
      },
    });
  } catch (error) {
    console.error("Error in adminSignup:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const signup = async (req, res) => {
  const { email, password, phoneNumber, role, username, firstName, lastName } =
    req.body;

  try {
    if (!email || !password || !phoneNumber) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ phoneNumber });
    console.log("userAlreadyExists", userAlreadyExists);

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      role,
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // jwt
    generateTokenAndSetCookie(res, user._id);

    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.phoneNumber);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Ensure `req.userId` exists (populated by middleware or extracted from JWT)
    const userId = req.user._id; // Adjust depending on your setup
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the user in the database, excluding the password
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Respond with the user information
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in checkAuth: ", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};


export const getAllRides = async (req, res) => {
  try {
    const rides = await adminPost.find();
    console.log(rides);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ status: false, message: "Error getting rides" });
  }
};

// pages/api/auth/check.js
export const checkAuthentication = async (req, res) => {
  try {
    // If the token is valid, return success
    return res.status(200).json({
      status: true,
      message: "User authenticated",
    });
  } catch (error) {
    console.error("Authentication check error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    // Ensure the user is authenticated
    const userId  = req.params.userId; // Assume `req.user` contains the authenticated user's details

    // Fetch the user details from the database by ID
    const user = await User.findById(userId).select("-password"); // Exclude the password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user details", error });
  }
};


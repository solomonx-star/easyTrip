import express from "express";
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import adminRoutes from "./routes/admin.route.js";
import emergencyRoute from "./routes/emergency.route.js";
import uploadRoute from "./routes/upload.route.js";
import updateProfile from "./routes/updateProfile.route.js";
import customerRoute from "./routes/customerBooking.route.js";
import pawapayRoute from "./routes/pawapay.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/emergency", emergencyRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/user", updateProfile);
app.use("/api/customer", customerRoute);
app.use("/api/payment", pawapayRoute);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    status: 404,
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on Port:", PORT);
});

//

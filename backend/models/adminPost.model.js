import mongoose from "mongoose";



const adminPostSchema = new mongoose.Schema(
    {
        pic: {
            type: String,
            required: true
        },
        departureTime: {
            type: String,
            required: true
        },
        etaTime: {
            type: String,
            required: true
        },
        availableSeats: {
            type: Number,
            required: true
        },
        vehicleInfo: {
            type: String
        },
        departureDate: {
            type: Date
        },
        vehicleNo: {
            type: String
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export const adminPost = mongoose.model("adminPost", adminPostSchema)
import mongoose from "mongoose";



const adminPostSchema = new mongoose.Schema(
    {
        pic: {
            type: String,
            required: true
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
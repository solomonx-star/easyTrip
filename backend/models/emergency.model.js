import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  email: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
});

export const Emergency = mongoose.model("Emergency", emergencySchema);

import Booking from "../models/booking.js";

export const createBooking = async (req, res) => {
  const { pickupLocation, dropoffLocation, fare } = req.body;
  const { userId } = req.user;

    try {
        const newBooking = new Booking({
      customer:userId,
      pickupLocation,
      dropoffLocation,
      fare,
    });
    const bookRide = await newBooking.save();
    if (bookRide) {
      return res.send({
        status: 200,
        message: "Successfully Booked",
        bookRide,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating booking", error: err.message });
  }
};

// module.exports = { createBooking };

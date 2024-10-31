import { Emergency } from "../models/emergency.model.js";

export const emergencyContact = async (req, res) => {
  const { firstName, lastName, phoneNumber, address, relationship } = req.body;
  const { userId } = req.user;

  try {
    const emergencyContactExist = await Emergency.findOne({ phoneNumber });
    if (emergencyContactExist) {
      return res
        .status(400)
        .json({ success: false, message: "Contact already exist" });
    }
    const newEmergency = new Emergency({
      userId: userId,
      firstName,
      lastName,
      phoneNumber,
      address,
      relationship,
    });

    const emergencyContact = await newEmergency.save();

    if (emergencyContact) {
      return res.send({
        status: 200,
        message: "Emergency contact successfully created",
        emergencyContact,
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllEmergencyContacts = async (req, res) => {
  try {
    const emergency = await Emergency.find();
    res.status(200).json(emergency);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting emergency contacts", error });
  }
};

export const updateEmergencyContacts = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Emergency.findByIdAndUpdate(id, { new: true });
    if (!contact) {
      res.status(200).json({ message: "Emergency contact updated", contact });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Emergency contact", error });
  }
};

export const deleteEmergencyContact = async (req, res) => {
  const { id } = req.params;

  try {
    const userContact = await Emergency.findByIdAndDelete(id);
    if (!userContact)
      return res.status(404).json({ message: "Emergency contact not found" });
    res.status(200).json({ message: "Emergency contact deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Emergency contact" });
  }
};

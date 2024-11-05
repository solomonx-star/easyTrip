import express from "express";
import { deleteEmergencyContact, emergencyContact, getAllEmergencyContacts, updateEmergencyContacts } from "../controllers/emergencyContact.controller.js";
import authMiddleware from "../Middleware/authMiddleware.js";



const router = express.Router();

router.post("/emergencyContact", authMiddleware, emergencyContact);
router.get("/getAllEmergencyContact", getAllEmergencyContacts)
router.put("/emergencyContact/:id", updateEmergencyContacts)
router.delete("/deleteContact/:id", deleteEmergencyContact)


export default router;
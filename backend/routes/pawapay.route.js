import express from "express";
import { pay, getPaymentStatus  } from "../controllers/payment.controller.js";


const router = express.Router();


router.post("/pay", pay);
router.get("/status/:transactionId", getPaymentStatus);


export default router;
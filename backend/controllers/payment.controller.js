import express from "express";
import { initializeTransaction } from "../services/pawapayService.js";


export const pay = async (req, res) => {
    const { amount, currency, recipient, metadata } = req.body;
    try {
         const transaction = await initializeTransaction({
           amount,
           currency,
           recipient,
           metadata,
         });
         res.status(200).json(transaction);
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}


export const getPaymentStatus = async (req, res) => {
    const { transactionId } = req.params;
    try {
        const status = await checkTransactionStatus(transactionId);
        res.status(200).json(status);
    } catch (error) {
        
    }
}
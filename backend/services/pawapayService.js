import axios from "axios";


import dotenv from "dotenv";

dotenv.config()

const PAWAPAY_BASE_URL = process.env.PAWAPAY_BASE_URL; // Replace with the actual base URL
const PAWAPAY_API_KEY = process.env.PAWAPAY_API_KEY;

console.log("Pawapay API Key:", PAWAPAY_BASE_URL);// Store your API key in .env

// Initialize a transaction
export const initializeTransaction = async ({
  amount,
  currency,
  recipient,
  metadata,
}) => {
  try {
    const response = await axios.post(
      `${PAWAPAY_BASE_URL}/transactions`,
      {
        amount,
        currency,
        recipient,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Transaction initialization failed"
    );
  }
};

// Check transaction status
export const checkTransactionStatus = async (transactionId) => {
  try {
    const response = await axios.get(
      `${PAWAPAY_BASE_URL}/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${PAWAPAY_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch transaction status"
    );
  }
};

// module.exports = {
//   initializeTransaction,
//   checkTransactionStatus,
// };

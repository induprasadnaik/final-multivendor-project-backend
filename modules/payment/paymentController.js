import Razorpay from "razorpay";
import crypto from "crypto";
import { createOrder } from '../customer/controllers/customerController.js' // your existing order logic

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount,
    });
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
};

// Verify Payment Signature
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
console.log("ORDER DATA RECEIVED:", orderData);
    // Payment verified  → create actual order in DB
    req.body = {
      ...orderData,
      paymentMethod: "Razorpay",
  paymentStatus: "paid",
  razorpayOrderId: razorpay_order_id,
  razorpayPaymentId: razorpay_payment_id,
  paidAt: new Date(),
    };

    return createOrder(req, res);
  } catch (err) {
    res.status(500).json({ message: "Payment verification error" });
  }
};

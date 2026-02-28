import express from 'express'
import {
    createRazorpayOrder,verifyPaymentAndCreateOrder
} from './paymentController.js'
import { createCODOrder } from  './orderController.js'
import {authMiddleware} from '../../middlewares/authmiddleware.js'

const router = express.Router();
router.post("/create-razorpay-order",authMiddleware, createRazorpayOrder);
router.post("/verifypayment",authMiddleware, verifyPaymentAndCreateOrder);
router.post("/cod", authMiddleware,createCODOrder);
export default router;

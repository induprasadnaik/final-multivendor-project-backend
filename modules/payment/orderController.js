import { createOrder } from '../customer/controllers/customerController.js' // your existing order logic

export const createCODOrder = async (req, res) => {
  req.body.paymentMethod = "COD";
  req.body.paymentStatus = "pending";

  return createOrder(req, res);
};

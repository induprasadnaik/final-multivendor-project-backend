import  mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
    {
        order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    vendorOrder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorOrder",
      required: true,
      index: true,
    },
      customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
     vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
     product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    /////for sales report
    productName: { type: String, required: true },
    category: { type: String, required: true, index: true },
    sku: { type: String },

    quantity: { type: Number, required: true },

    price: { type: Number, required: true }, // selling price at order time
    total: { type: Number, required: true }, // price * qty
        orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
   orderedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
 
);
export default mongoose.model("OrderItem", orderItemSchema);
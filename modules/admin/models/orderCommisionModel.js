import mongoose from 'mongoose'

const orderCommissionSchema  = new mongoose.Schema(
    {
    vendorId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Vendor",
    required: true },
vendorOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "VendorOrder", required: true },

  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
 commissionPercent: { type: Number, required: true },
 commissionAmount: { type: Number, required: true },
 vendorEarning: { type: Number, required: true },
 isPaidToAdmin: { type: Boolean, default: false },
  paidAt: { type: Date },
    },
     { timestamps: true }

);
export default mongoose.model("OrderCommission",orderCommissionSchema);
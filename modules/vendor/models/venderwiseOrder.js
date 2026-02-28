import mongoose from 'mongoose'

const vendorOrderSchema = new mongoose.Schema(
    {
        order_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order",
            required:true,
             index: true,
        },
        vendor_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Vendor",
            required:true,
             index: true,
        },
          customer_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Customer",
            required:true,
             index: true,
        },
        items:[
            {
               product_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
                 index: true,
               },
               quantity:{ type: Number, required: true },
               price:{ type: Number, required: true },
               total:{ type: Number, required: true },

            },
        ],
        subTotal:{ type: Number, default: 0 },
        vendorEarning:{ type: Number, default: 0 },
        platformCommisson:{ type: Number, default: 0 },
        vendorPaymentStatus:{
            type:String,
            enum:["pending","paid"],
            default:"pending",
            index: true
        },
        orderStatus:{
            type:String,
            enum:["pending", "confirmed","packed","shipped", "delivered", "cancelled"],
            default:"pending",
            index: true
        },
            statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "packed",
            "shipped",
            "delivered",
            "cancelled",
          ],
        },
        date: { type: Date, default: Date.now },
      },
    ],
    },
    {timestamps:true}
);
export default mongoose.model("VendorOrder",vendorOrderSchema);
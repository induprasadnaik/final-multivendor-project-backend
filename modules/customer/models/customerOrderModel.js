import mongoose from 'mongoose'

const oderSchema = new mongoose.Schema(
    {
   orderNumber :{
    type:String,unique:true,required:true,index:true
   },
   user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   customer_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Customer",
     required: true,
   },
   totalItems:{ type: Number, default: 0 },
   subTotal:{ type: Number, default: 0 },
   tax:{ type: Number, default: 0 },
   discount:{ type: Number, default: 0 },
   grandTotal:{ type: Number, default: 0 },

   paymentMethod:{
    type:String,
    enum:["COD", "Razorpay", "wallet"],
    required: true,
   },
  paymentStatus:{
    type:String,
    enum:["pending", "paid", "failed"],
    required:true
  },
  razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paidAt: { type: Date },
    
   orderStatus:{
    type:String,
    enum:["placed", "partially_confirmed", "completed", "cancelled"],
    required:true
   },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
       mobile: String
    },
},
  { timestamps: true }

);
export default mongoose.model("Order",oderSchema);
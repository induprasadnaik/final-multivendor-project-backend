import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
    {
   user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
   },
   customer_id : {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Customer",
    required:true
   },
   items:[
    {
        vendor_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Vendor",
            required:true

        },
        product_id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
         productName: { type: String, required: true },

        quantity: { type: Number, required: true, min: 1 },

        price: { type: Number, required: true }, 
        discountedPrice: { type: Number, required: true },   // final price after discount
    discountPercent: { type: Number, required: true },

 itemSubTotal: { type: Number, required: true },  // price * qty
    itemDiscount: { type: Number, required: true },  // discount amount * qty
    itemTotal: { type: Number, required: true },      },
   ],
  subTotal :{type:Number,default:0},
  tax:{type:Number,default:0},
  discount:{ type: Number, default: 0 },
  grandTotal:{type:Number,default:0},
    },
    {timestamps : true}
);

export default mongoose.model("Cart",cartSchema);
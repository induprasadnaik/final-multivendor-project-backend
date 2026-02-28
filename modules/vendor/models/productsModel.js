import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
    user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
    
   vendor_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    required:true
   },
  
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    brand: {
      type: String,
    },

    // ✅ Product Images
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // if using Cloudinary
      },
    ],

    // ✅ Pricing
    price: {
      type: Number,
      required: true,
    },

    discountPercent: {
      type: Number,
      default: 0,   // ✅ IMPORTANT (explained below)
    },

    discountedPrice: {
      type: Number,
      default: 0,
    },

    // ✅ Inventory
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
minStock: {         
  type: Number,
  default: 0,
},
    sku: {
      type: String,
      unique: true,
      required: true,
    },

    // ✅ Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Product Rating System
    ratingAvg: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
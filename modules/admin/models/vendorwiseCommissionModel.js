import mongoose from 'mongoose'

const vendorCommissionSchema = new mongoose.Schema(
    {
       vendor_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Vendor",
         required: true
       },
        commission: 
        { type: Number,
         default: null, 
         min: 0, 
         max: 100
         }, 
    },
      { timestamps: true }  
);
export default mongoose.model("VendorCommission",vendorCommissionSchema);
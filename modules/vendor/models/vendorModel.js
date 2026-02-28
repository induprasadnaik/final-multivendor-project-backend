import mongoose from 'mongoose'

const vendorSchema =new mongoose.Schema(
    {
        user_id :{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        shopName :{type:String,required:true},
        vendorName :{type:String,required:true},
        mobile: { type: String},
        address:[{
            street:String,
            city:String,
            state:String,
            pincode:String
        }],
        status:{type:String,enum:["pending", "approved", "rejected"],  default: "pending"},
        isActive:{type:Boolean,default:false,index:true},
        lastLoginAt: {type: Date},
    },
    {timestamps:true}
);
export default mongoose.model("Vendor",vendorSchema);
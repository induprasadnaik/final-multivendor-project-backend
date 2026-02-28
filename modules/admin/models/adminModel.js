import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
    {
     username:{type:String,required:true},
     email:{ type: String, required: true,unique: true,lowercase: true,index: true},
     password:{type:String,required:true,select:false},
     role:{type:String,enum:["admin", "vendor", "customer"],required:true}  ,
     isActive: { type: Boolean, default: true, index:true},
     lastLoginAt: { type: Date }
   
    },
 { timestamps: true }
);
export default mongoose.model("User",adminSchema)
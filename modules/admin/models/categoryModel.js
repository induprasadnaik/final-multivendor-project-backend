import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
    {
  name :{type:String,
    required:true,
    trim:true,
    unique:true
},
 imageUrl: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
},
  { timestamps: true }
);
export default mongoose.model("Category",categorySchema);

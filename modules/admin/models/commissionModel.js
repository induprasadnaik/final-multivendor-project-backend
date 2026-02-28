import  mongoose from 'mongoose'

const commissionSchema = new mongoose.Schema(
    {
  globalCommissionPercentage :{
    type:Number,
    required:true,
    default:0,
    min:0,
    max:100,
  },
     },
  {timestamps:true}
 
);
export default mongoose.model("Commission",commissionSchema);

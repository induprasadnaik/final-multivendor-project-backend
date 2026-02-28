import Commission from '../models/commissionModel.js'
import VendorCommission from '../models/vendorwiseCommissionModel.js'
import Vendor from '../../vendor/models/vendorModel.js'
import OrderItem from '../../vendor/models/orderItem.js';

export const setGlobalCommission = async(req,res)=>{
    try{
   const {globalCommissionPercentage } = req.body;
   if(globalCommissionPercentage<0 || globalCommissionPercentage>100){
    return res.status(400).json({
        success:true,
        message :"commission must be between 0 and 100"
    });
   }
   const commission = await Commission.findOne();
   const updated = commission ? await Commission.findByIdAndUpdate(commission._id,{globalCommissionPercentage},{new:true}):
   await Commission.create({globalCommissionPercentage});
   res.status(201).json({message:"global commission updated",updated})
}
 catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/////api to get existing commisson
export const getcommisssion = async(req,res)=>{
    try{
   const commission= await Commission.findOne();
   res.status(200).json({
    success:true,
    globalCommission:commission?.globalCommissionPercentage || 0,
   });
    }
     catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//////vendorwise update commission
export  const vendorCommisson = async(req,res)=>{
    try{
        const {vendorId}=req.params;
        const {commission} = req.body;
         if (commission < 0 || commission > 100) {
      return res.status(400).json({
        success: false,
        message: "Commission must be between 0 and 100",
      });
    }

        const vendor = await VendorCommission.findOneAndUpdate(
            {vendor_id:vendorId},
            {commission},
            {new:true,  upsert: true }
       );
        if (!vendor)
            { 
                return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(201).json({ message: "Vendor commission updated", vendor });
}
     catch (err) {
    res.status(500).json({ message: err.message });
  }

};

//////vendor-wise commission report 
export const vendorCommissionReport = async (req, res) => {
  try {
    // Get global commission
    const globalDoc = await Commission.findOne();
    const globalCommission = globalDoc?.globalCommissionPercentage || 0;

    // Get all approved vendors
    const vendors = await Vendor.find({ status: "approved" })
      .select("shopName vendorName");
    // Get vendor-specific commissions
    const vendorCommissionDocs = await VendorCommission.find();
    const vendorCommissionMap = new Map(
      vendorCommissionDocs.map(v => [String(v.vendor_id), v.commission])
    );

    // Prepare response
    const final = vendors.map(vendor => {
      const overrideCommission = vendorCommissionMap.get(String(vendor._id));

      return {
        vendorId: vendor._id,
        shopName: vendor.shopName,
        vendorName: vendor.vendorName,
        commissionEditable: overrideCommission ?? globalCommission, // shown in textbox
        isOverride: overrideCommission != null
      };
    });

    res.status(200).json({
      success: true,
      globalCommission,
      final,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

import express from 'express'
import { getallOrders,deleteOrders,updateCustomerprofile,getCustomerbyId,
    getTodayOrderlist,getvendororders,getorderwisetrack,getallproducts,editAddress,
    addAddress,getCustomerOrders,getOrderDetails,sendContactMessage,reviewproduct } from '../controllers/customerController.js'
import {authMiddleware} from '../../../middlewares/authmiddleware.js'
import {addwishlist,deletewishlist,getWishlist} from '../controllers/wishlistController.js'
import Customer from '../models/customerModel.js'
const router = express.Router();
////router.post("/orders", createOrder);
router.get("/orders", getallOrders);
router.get("/vendorwiseorders", getvendororders);
router.get("/ordertrack", getorderwisetrack);
router.get("/getallproducts", getallproducts);
router.delete("/orders/:id", deleteOrders);
router.put("/updateprofile", updateCustomerprofile);
router.get("/getprofile/:userId", getCustomerbyId);
router.get("/todayorders",getTodayOrderlist)
//////multiple address add and edit
router.post("/addaddress/:customerId",addAddress);
router.put("/editaddress/:customerId/:addressId",editAddress);
/////wishlist 
router.post("/wishlist", authMiddleware, addwishlist);
router.delete("/wishlist/:productId", authMiddleware, deletewishlist);
router.get("/wishlist", authMiddleware, getWishlist);

//////orders
router.get("/customerorders/:customerId", authMiddleware, getCustomerOrders);
router.get("/orderdetails/:orderId", authMiddleware, getOrderDetails);
//////contagepage 
router.post("/contactus", sendContactMessage);
///////review product 

router.post("/addreview",authMiddleware,reviewproduct);
/////get customerid
router.get("/by-user/:id",async(req,res)=>{
   try {
    
    const customer =  await Customer.findOne({user_id:req.params.id});
   if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
  res.status(200).json({ customerId: customer._id });
   }
   catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
})

export default router;
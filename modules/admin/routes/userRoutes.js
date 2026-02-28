import express from 'express'
import {setupAdmin,registerCustomer,registerVendor,registerAdmin,loginUser} from '../controllers/userController.js'
import {authMiddleware,authorizeRoles} from '../../../middlewares/authmiddleware.js'
import User from "../models/adminModel.js"

const router = express.Router();
///setup firsttime admin
router.post('/setup-admin',setupAdmin);

///////signup
router.post('/register/customer',registerCustomer);
router.post('/register/vendor',registerVendor);
router.post('/register/admin', authMiddleware, authorizeRoles("admin"),registerAdmin);
/////signin
router.post('/login',loginUser);

router.get("/checkUser",authMiddleware ,(req,res)=>{
    res.json({user_id:req.loggedUser._id,username:req.loggedUser.username,role:req.loggedUser.role});
});

router.post("/logout",authMiddleware,(req,res)=>{
    res.clearCookie("token", {
    httpOnly: true,
    //  secure: false,   
    // sameSite: "lax",
    secure: true,        // REQUIRED in production,
    sameSite: "none"     // REQUIRED for cross-site  
      });
    res.json({message:"logged out successfully"});
});
export default router;
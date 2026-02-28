import express from 'express'
import {getadminDashboardStats,pendingApprovals,updateVendorStatus,getAllCustomers,getAllVendors,blockUser,getvendorslist,getAllMessages, markAsRead, deleteMessage,getUnreadCount} from "../controllers/adminController.js"
import { setGlobalCommission,vendorCommisson,getcommisssion ,vendorCommissionReport} from '../controllers/globalCommissionController.js'
import { categoryupload } from '../../../middlewares/categoryupload.js';
import { addcategory,getcategories,getactivecategories,updatecategory,blockunblockcat,getOrderStatusStats,getLast7DaysEarnings ,getVendorSalesReport   } from '../controllers/adminController.js'
import { authMiddleware, authorizeRoles } from "../../../middlewares/authmiddleware.js";
const router = express.Router();
router.get("/dashboard-stats" , authMiddleware, authorizeRoles("admin"),getadminDashboardStats );
router.get('/pendings', authMiddleware, authorizeRoles("admin"),pendingApprovals);
router.patch('/updatestatus/:id', authMiddleware, authorizeRoles("admin"),updateVendorStatus);
router.get('/allcustomers', authMiddleware, authorizeRoles("admin"),getAllCustomers);
router.get('/allvendors', authMiddleware, authorizeRoles("admin"),getAllVendors);
router.patch('/blockuser/:id', authMiddleware, authorizeRoles("admin"),blockUser);
router.get('/vendorslist', authMiddleware, authorizeRoles("admin"),getvendorslist);
router.get("/earningslast7days", authMiddleware, authorizeRoles("admin"), getLast7DaysEarnings);
router.get("/orderstatusstats", authMiddleware, authorizeRoles("admin"), getOrderStatusStats);
router.get("/vendor-sales-report", authMiddleware, authorizeRoles("admin"), getVendorSalesReport);


////commission
router.post('/global-commision', authMiddleware, authorizeRoles("admin"),setGlobalCommission);
router.put('/vendorwise-commision/:vendorId', authMiddleware, authorizeRoles("admin"),vendorCommisson);
router.get("/global-commision", authMiddleware, authorizeRoles("admin"),getcommisssion);
router.get("/vendor-commission-report", authMiddleware, authorizeRoles("admin"), vendorCommissionReport);

/////category 
router.post("/addcategory", authMiddleware, authorizeRoles("admin"),categoryupload.single("image"),addcategory);
router.get("/getcategories",getcategories);
router.get("/getactivecategories",getactivecategories);
router.patch("/toggleblock/:id", authMiddleware, authorizeRoles("admin"),blockunblockcat);
router.put("/updatecategory/:id", authMiddleware, authorizeRoles("admin"),categoryupload.single("image"), updatecategory);

////////getcontactdetails

router.get("/contact", authMiddleware, authorizeRoles("admin"),  getAllMessages);
router.put("/contact/:id/read", authMiddleware, authorizeRoles("admin"),  markAsRead);
router.delete("/contact/:id", authMiddleware, authorizeRoles("admin"),  deleteMessage);
router.get("/unreadcontact", authMiddleware, authorizeRoles("admin"),  getUnreadCount);
export default router;

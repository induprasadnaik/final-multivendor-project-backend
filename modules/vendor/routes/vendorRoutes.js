import express from 'express'
import { addProduct,getproductById,blockProduct,getvendorwiseProduct,updateProduct,updateVendorprofile ,getVendorwiseCustomerorder,
   unblockProduct,getVendorbyId,productWiseSalesReport,getvendorwiseProductblocked,lowstockproducts,getproductBybrand,updateVendorOrderStatus} from '../controllers/vendorController.js'
import {upload} from '../../../middlewares/upload.js'
import {authMiddleware,authorizeRoles} from '../../../middlewares/authmiddleware.js'
import {
  getVendorSummary,
  getSalesChart,
  getOrderStatusBreakdown,
  getTopProducts,
  getRecentOrders,
  getVendorProductSalesReport
} from "../controllers/vendorDashboardController.js";

const router = express.Router();
router.get("/getprofile",getVendorbyId)
router.put("/updateprofile",updateVendorprofile)

router.post("/addproduct", authMiddleware, authorizeRoles("vendor"),upload.array("images", 5),addProduct);
router.get("/vendorwise",authMiddleware, authorizeRoles("vendor"),getvendorwiseProduct)
router.get("/vendorwiseblocked",authMiddleware, authorizeRoles("vendor"),getvendorwiseProductblocked)
router.patch("/blockproduct/:id",authMiddleware, authorizeRoles("vendor"),blockProduct)
router.patch("/unblockproduct/:id",authMiddleware, authorizeRoles("vendor"),unblockProduct)
router.get("/lowstock",authMiddleware, authorizeRoles("vendor"),authMiddleware,lowstockproducts)
router.get("/brandproducts",getproductBybrand);
router.put("/editproduct/:id",authMiddleware, authorizeRoles("vendor"), upload.array("images", 5),updateProduct)
router.get("/product/id/:id",getproductById)

router.get("/orders",authMiddleware, authorizeRoles("vendor"),getVendorwiseCustomerorder)
/////////vendor orderstatus update
router.patch("/orderstatusupdate/:vendorOrderId",authMiddleware, authorizeRoles("vendor"),updateVendorOrderStatus)

///////////vendor dashboards

router.get("/summary",authMiddleware, authorizeRoles("vendor"), getVendorSummary);
router.get("/sales-chart",authMiddleware, authorizeRoles("vendor"), getSalesChart);
router.get("/order-status",authMiddleware, authorizeRoles("vendor"), getOrderStatusBreakdown);
router.get("/top-products" ,authMiddleware, authorizeRoles("vendor"), getTopProducts);
router.get("/recent-orders" ,authMiddleware, authorizeRoles("vendor"), getRecentOrders);
router.get("/productsalesreport", authMiddleware, authorizeRoles("vendor"), getVendorProductSalesReport);
router.get("/prduct-wise-sales-report",authMiddleware, authorizeRoles("vendor"),productWiseSalesReport)
export default router;
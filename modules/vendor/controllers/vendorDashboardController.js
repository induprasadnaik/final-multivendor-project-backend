import VendorOrder from "../models/venderwiseOrder.js";
import OrderItem from "../models/orderItem.js";
import Vendor from "../models/vendorModel.js"
import Product from '../models/productsModel.js'
import OrderCommission  from '../../admin/models/orderCommisionModel.js'
import mongoose from "mongoose";

const todayRange = () => {
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date();
  end.setHours(23,59,59,999);
  return { start, end };
};

export const getVendorSummary = async (req, res) => {
   const  userid = req.loggedUser._id;
  const vendor = await Vendor.findOne({user_id: userid})
  if (!vendor) {
    return res.status(404).json({ message: "Vendor profile not found" });
  }
  const vendorId = vendor._id;
  const { start, end } = todayRange();

  const salesToday = await VendorOrder.aggregate([
    { $match: { vendor_id: vendorId, orderStatus: "delivered", createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: "$vendorEarning" } } }
  ]);

  const ordersToday = await VendorOrder.countDocuments({
    vendor_id: vendorId,
    createdAt: { $gte: start, $lte: end }
  });

  const itemsSold = await OrderItem.aggregate([
    { $match: { vendor_id: vendorId, orderStatus: "delivered", orderedAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, qty: { $sum: "$quantity" } } }
  ]);

  const pendingOrders = await VendorOrder.countDocuments({
    vendor_id: vendorId,
    orderStatus: { $in: ["pending","confirmed","packed"] }
  });

  res.json({
    salesToday: salesToday[0]?.total || 0,
    ordersToday,
    itemsSold: itemsSold[0]?.qty || 0,
    pendingOrders
  });
};
//////Sales Last 7 Days

export const getSalesChart = async (req, res) => {
  const  userid = req.loggedUser._id;
  const vendor = await Vendor.findOne({user_id: userid})
  if (!vendor) {
    return res.status(404).json({ message: "Vendor profile not found" });
  }
  const vendorId = vendor._id;  const last7 = new Date();
  last7.setDate(last7.getDate() - 6);

  const data = await VendorOrder.aggregate([
    { $match: { vendor_id: vendorId, orderStatus: "delivered", createdAt: { $gte: last7 } } },
    { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$vendorEarning" }
    }},
    { $sort: { _id: 1 } }
  ]);

  res.json(data);
};
///////Order Status Pie
export const getOrderStatusBreakdown = async (req, res) => {
  const  userid = req.loggedUser._id;
  const vendor = await Vendor.findOne({user_id: userid})
  if (!vendor) {
    return res.status(404).json({ message: "Vendor profile not found" });
  }
  const vendorId = vendor._id;
  const data = await VendorOrder.aggregate([
    { $match: { vendor_id: vendorId } },
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
  ]);

  res.json(data);
};
///////Top Products
export const getTopProducts = async (req, res) => {
  const  userid = req.loggedUser._id;
  const vendor = await Vendor.findOne({user_id: userid})
  if (!vendor) {
    return res.status(404).json({ message: "Vendor profile not found" });
  }
  const vendorId = vendor._id;
  const data = await OrderItem.aggregate([
    { $match: { vendor_id: vendorId, orderStatus: "delivered" } },
    { $group: {
        _id: "$product_id",
        name: { $first: "$productName" },
        sold: { $sum: "$quantity" },
        revenue: { $sum: "$total" }
    }},
    { $sort: { sold: -1 } },
    { $limit: 5 }
  ]);

  res.json(data);
};
//////Recent Orders
export const getRecentOrders = async (req, res) => {
  const  userid = req.loggedUser._id;
  const vendor = await Vendor.findOne({user_id: userid})
  if (!vendor) {
    return res.status(404).json({ message: "Vendor profile not found" });
  }
  const vendorId = vendor._id;
  const orders = await VendorOrder.find({ vendor_id: vendorId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("customer_id", "name");

  res.json(orders);
};


/////vendor ise sales reports


export const getVendorProductSalesReport = async (req, res) => {
  try {
    const userid = req.loggedUser._id;
    const vendor = await Vendor.findOne({ user_id: userid });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const vendorId = vendor._id;
    const { fdate, tdate, page = 1, limit = 10 } = req.query;

    const match = {
      vendor_id: new mongoose.Types.ObjectId(vendorId),
      orderStatus: "delivered",
    };

    if (fdate && tdate) {
      const start = new Date(fdate);
      const end = new Date(tdate);
      end.setHours(23, 59, 59, 999);
      match.orderedAt = { $gte: start, $lte: end };
    }

    const skip = (page - 1) * limit;

    const report = await OrderItem.aggregate([
      { $match: match },

      //  Group by product
      {
        $group: {
          _id: "$product_id",
          productName: { $first: "$productName" },
          totalQty: { $sum: "$quantity" },
          grossSales: { $sum: "$total" },
          vendorOrderIds: { $addToSet: "$vendorOrder_id" },
        },
      },

      //  Join vendor orders to calculate commission & earnings
      {
        $lookup: {
          from: "vendororders",
          localField: "vendorOrderIds",
          foreignField: "_id",
          as: "vendorOrders",
        },
      },

      {
        $addFields: {
          totalCommission: { $sum: "$vendorOrders.platformCommisson" },
          totalVendorEarning: { $sum: "$vendorOrders.vendorEarning" },
        },
      },

      //  Product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      {
        $project: {
          productId: "$_id",
          name: "$product.name",
          images: "$product.images",
          category: "$product.category",
          price: "$product.price",
          totalQty: 1,
          grossSales: 1,
          totalCommission: 1,
          totalVendorEarning: 1,
        },
      },

      { $sort: { grossSales: -1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ]);

    const totalProducts = await OrderItem.aggregate([
      { $match: match },
      { $group: { _id: "$product_id" } },
      { $count: "count" },
    ]);

    res.status(200).json({
      success: true,
      report,
      pagination: {
        total: totalProducts[0]?.count || 0,
        page: Number(page),
        totalpages: Math.ceil((totalProducts[0]?.count || 0) / limit),
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


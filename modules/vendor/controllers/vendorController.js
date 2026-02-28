import Product from '../models/productsModel.js'
import Vendor from '../models/vendorModel.js'
import VendorOrder from '../models/venderwiseOrder.js'
import OrderItem from '../models/orderItem.js'
import {getIO  } from "../../../socket.js"
import mongoose from 'mongoose'

export const addProduct =async(req,res)=>{
    try{
     const {
      name,
      description,
      category,
      brand,
      price,
      discountPercent,
      stock,
      minStock,
      sku,
      isActive,
    } = req.body;
   const  userid = req.loggedUser._id;
const vendor = await Vendor.findOne({user_id: userid})
if (!vendor) {
  return res.status(404).json({ message: "Vendor profile not found" });
}
const vendor_id = vendor._id;
    //validation
  if (!name || !description || !category || !price || !stock || !sku || !minStock) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingsku = await Product.findOne({sku})
   if(existingsku){
     return res.status(400).json({
      success: false,
      message: "SKU already exists"
    });
   }

   const parsedprice = Number(price);
   const parseddiscount =  Number(discountPercent) ||0;
   const parsedstock = Number(stock);
   const parsedMinStock = Number(minStock) || 0;
   //calculate discounted price
 
   const discountedPrice = parsedprice - (parsedprice * parseddiscount) / 100;
     //  Get images from Cloudinary upload
    const images = req.files?.map(file => ({
      url: file.path,       // Cloudinary URL
      public_id: file.filename,
    })) || [];


//add product table
const product = await Product.create({
    user_id:userid,
  vendor_id,
      name,
      description,
      category,
      brand,
      images,
      price:parsedprice,
      discountPercent: parseddiscount,
      discountedPrice,
      stock:parsedstock,
      minStock: parsedMinStock,
      sku,
      isActive: isActive ?? true, 
});
  return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
       });
}
 
    catch(error){
      console.error("ADD PRODUCT ERROR:", error);
        res.status(500).json({message:"server error",error:error.message})
    }
};

//get product by id
export const  getproductById = async(req,res)=>{
    try{
const {id} = req.params;
 if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
const products = await Product.findById(id).populate("vendor_id","shopName email mobile")
 if(!products){
  res.status(404).json({ success: false,message: "Product not found",})
  
 }

res.status(200).json({success:true,products})
}
    catch(error){
   res.status(500).json({success:false,message:"server error",error:error.message})
   
    }
};
/////get products by brand
export const  getproductBybrand = async(req,res)=>{
    try{
const {brand} = req.query;

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand  is required",
      });
    }
const products = await Product.find({brand}).populate("vendor_id","shopName email mobile")
 if(!products){
  res.status(404).json({ success: false,message: "Product not found",})
  
 }

res.status(200).json({success:true,products})
}
    catch(error){
   res.status(500).json({success:false,message:"server error",error:error.message})
   
    }
};
///delete product

export const blockProduct = async(req,res)=>{
    try{
  const {id} = req.params;
  const product = await Product.findByIdAndUpdate(id,{isActive:false},{ new: true });
  if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  res.status(200).json({
    success: true,
      message: "Product blocked successfully",
  })
}
    catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }
};
/////unblock product
export const unblockProduct = async(req,res)=>{
    try{
  const {id} = req.params;
  const product = await Product.findByIdAndUpdate(id,{isActive:true},{ new: true });
  if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  res.status(200).json({
    success: true,
      message: "Product unblocked successfully",
  })
}
    catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }
};
/////get products vendorwise
export const getvendorwiseProduct = async(req,res)=>{
   
try{

   //getting vendor id by using userid   
      const  userid = req.loggedUser._id;
const vendor = await Vendor.findOne({user_id: userid})
if (!vendor) {
  return res.status(404).json({ message: "Vendor profile not found" });
}
const {category,search, page ,limit } =req.query;
const query = {vendor_id:vendor._id};
      query.isActive =true;
      if(category && category !=="All"){
        query.category=category;
      }
      if(search)
      {
        query.$or=[
          {name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        ];
      }
      const skip = (page -1) * limit;

     const products = await Product.find(query).sort({createdAt: -1,}).skip(skip).limit(limit);
    const totalproducts = await Product.countDocuments(query);
     res.status(200).json({
      success: true,
        products,
      pagination:{
      totalproducts,
    totalpages:Math.ceil(totalproducts/limit),
  },
    
    });
    }
        catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }

};
/////////getvendorwiseblockedproducts
export const getvendorwiseProductblocked = async(req,res)=>{
   
try{

   //getting vendor id by using userid   
      const  userid = req.loggedUser._id;
const vendor = await Vendor.findOne({user_id: userid})
if (!vendor) {
  return res.status(404).json({ message: "Vendor profile not found" });
}
const {search, page ,limit } =req.query;
const query = {vendor_id:vendor._id};
      query.isActive =false;
    
      if(search)
      {
        query.$or=[
          {name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        ];
      }
      const skip = (page -1) * limit;

     const products = await Product.find(query).sort({createdAt: -1,}).skip(skip).limit(limit);
    const totalproducts = await Product.countDocuments(query);
     res.status(200).json({
      success: true,
        products,
      pagination:{
      totalproducts,
    totalpages:Math.ceil(totalproducts/limit),
  },
    
    });
    }
        catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }

};
//////update product

export const updateProduct = async(req,res)=>{
    try{
      const{id} = req.params;
      const product = await Product.findById(id);
      if(!product){
        res.status(404).json({success:false,message:"product not found"});
      }
          // Update fields
    product.vendor_id = product.vendor_id;
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price ?? product.price;
    product.discountPercent = req.body.discountPercent ?? product.discountPercent;
    product.stock = req.body.stock ?? product.stock;
    product.minStock = req.body.minStock ?? product.minStock;
    product.sku = req.body.sku || product.sku;
    product.isActive = req.body.isActive ?? product.isActive;
      //  If NEW images uploaded → replace old images
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        url: file.path,       // Cloudinary URL
        public_id: file.filename,
      }));

      product.images = images;
    }
/////calculate discounted price
    let discountedPrice = product.price;
    if (product.discountPercent > 0) {
      discountedPrice =
        product.price - (product.price * product.discountPercent) / 100;
    }
    product.discountedPrice = discountedPrice;

  await product.save();
  
 res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

}
       catch(error){
        res.status(500).json({
            success:false,
            message:"sever error",
            error:error.message
        })
    }

};
//////////min-stock alert
export const lowstockproducts = async(req,res)=>{
  try{
     const  userid = req.loggedUser._id;
const vendor = await Vendor.findOne({user_id: userid})
if (!vendor) {
  return res.status(404).json({ message: "Vendor profile not found" });
}
   const vendorid = vendor._id;
   const products = await Product.find({
    vendor_id:vendorid,
    $expr:{$lte:["$stock","$minStock"]}
   }).select("name stock minStock");
res.status(200).json({
      lowStockcount: products.length,
      products
    });
  }
  catch(err){
    res.status(500).json({
       success:false,
            message:"sever error",
            error:err.message
    })
  }
}

/////update vendor profile
export const updateVendorprofile = async(req,res)=>{
  try{
const userId = req.loggedUser._id;
const  updated = await Vendor.findOneAndUpdate({ user_id: userId },
    { $set: req.body },
    { new: true });
      res.status(200).json({ success: true, data: updated });
  }
  catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}
};
//////Get vendorwise customers orders list
export const getVendorwiseCustomerorder = async(req,res)=>{
try{
const userId = req.loggedUser._id;
const vendor = await Vendor.findOne({user_id:userId})
const orders = await VendorOrder.find({vendor_id:vendor._id}).populate("customer_id", "customerName mobile address")
.populate("items.product_id", "name price")
      .populate("order_id", "orderNumber paymentStatus paymentMethod status createdAt");

res.status(200).json({ success: true, data: orders });
}
  catch(error){
   res.status(500).json({message:"Server error", error: error.message});   
}
};
//////get vendor by id
export const getVendorbyId =async(req,res)=>{
    try{
    const userId = req.loggedUser._id;
    const vendor = await Vendor.findOne({user_id:userId});
    res.status(200).json({ success: true, data: vendor });
    }
    catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}
};
///////update vendor order status
export const updateVendorOrderStatus = async (req, res) => {
  try {
    const { vendorOrderId } = req.params;
    const { status } = req.body;

    const vendorOrder = await VendorOrder.findById(vendorOrderId).populate("customer_id");;
    if (!vendorOrder) return res.status(404).json({ message: "Vendor order not found" });

    vendorOrder.orderStatus = status;
    vendorOrder.statusHistory.push({ status });

    await vendorOrder.save();
    ////////orderitrm status update
   await OrderItem.updateMany(
  { vendorOrder_id: vendorOrderId },
  { orderStatus: status }
);
//////Emit real-time update to that specific customer
        const io = getIO();
        const customerRoom = vendorOrder.customer_id._id.toString();
console.log("Emitting to room:", customerRoom);

io.to(customerRoom).emit("orderStatusUpdated", {
  vendorOrderId,
  status,
});
res.json({ success: true, vendorOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Status update failed" });
  }
};

////////////////SALES REPORT 
 export const productWiseSalesReport = async(req,res)=>{
  try{
 const { from,to,vendor_id,category} = req.body;
 const match ={};
 if(from || to) match.createdAt ={};
 if(from) match.createdAt.$gte = new Date(from);
 if(to)  match.createdAt.$lte = new Date(to);

 if(vendor_id) match.vendor_id = new mongoose.Types.ObjectId(vendor_id);
if(category) match.category = category;
/////Delivered only for sales

match.orderStatus ="delivered";
const report = await OrderItem.aggregate([
  {$match:match},
  {
    $group:{
      _id:"$product_id",
       productName: { $first: "$productName" },
          category: { $first: "$category" },
          vendor_id: { $first: "$vendor_id" },
          qtySold: { $sum: "$quantity" },
          netSales: { $sum: "$total" },
    },
  },
 { $sort: { netSales: -1 } },
]);
 res.status(200).json({ success: true, report });

  }
 catch(error){
  res.status(500).json({message:"Server error", error: error.message});   
}
 
 };




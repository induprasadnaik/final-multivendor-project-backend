import Cart from "../models/customerCart.js"
import Product from "../../vendor/models/productsModel.js"

////calculate total
const calculateTotals = (cart) => {
  cart.subTotal = cart.items.reduce((acc, item) => acc + item.itemSubTotal, 0);
  cart.discount = cart.items.reduce((acc, item) => acc + item.itemDiscount, 0);
  cart.tax = cart.subTotal * 0.05;
  cart.grandTotal = cart.subTotal + cart.tax - cart.discount;
};

const populateCart = async (cart) => {
  return await cart.populate([
    { path: "items.product_id" },
    { path: "items.vendor_id" },
    { path: "customer_id" },
    { path: "user_id" }
  ]);
};
///add to cart
export const addtoCart = async(req,res)=>{
    try{
    let {user_id,customer_id,vendor_id,product_id,quantity} = req.body; 
    if(!user_id || !customer_id || !vendor_id|| !product_id || !quantity)
    {
      return   res.status(400).json({ message: "All fields are required"});
    }
    if (quantity < 1) quantity = 1;
   const product = await Product.findById(product_id);
   if(!product) {
    return res.status(404).json({message:"product not found"});
   }
   const price =product.price;
   const productName = product.name;
   
   const discountedPrice = product.discountedPrice;
const discountPercent = product.discountPercent;

const itemSubTotal = price * quantity;
const itemDiscount = (price - discountedPrice) * quantity;
const itemTotal = discountedPrice * quantity;
   ///if no cart,create new
   let cart = await Cart.findOne({user_id});

   if(!cart){
    cart=new Cart({
       user_id,
        customer_id,
        items: [
          {
            vendor_id,
            product_id,
            productName,
            quantity,
           price,
  discountedPrice,
  discountPercent,
  itemSubTotal,
  itemDiscount,
  itemTotal
          },
        ],
      });   

calculateTotals(cart);
await cart.save();
const populatedCart = await populateCart(cart);
return res.status(200).json({ message: "Item added to cart", cart: populatedCart });}
//check item already exists in the cart
const itemIndex = cart.items.findIndex(
    (item)=>item.product_id.toString()===product_id.toString()
);

if(itemIndex> -1){
 // product exists → increase quantity
const item = cart.items[itemIndex];
item.quantity += quantity;
item.itemSubTotal = item.price * item.quantity;
item.itemDiscount = (item.price - item.discountedPrice) * item.quantity;
item.itemTotal = item.discountedPrice * item.quantity;}
else{
   // new product push
      cart.items.push({
        vendor_id,
        product_id,
        productName,
        quantity,
         price,
  discountedPrice,
  discountPercent,
  itemSubTotal,
  itemDiscount,
  itemTotal
      }); 
}
   calculateTotals(cart);
    await cart.save();
const populatedCart = await populateCart(cart);
    return res.status(200).json({ message: "Item added to cart", cart:populatedCart});
 
}
    catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }
};

/////get cart by user
export const getcartbyUser = async(req,res)=>{
    try{
   const {userId} = req.params;
   const cart = await Cart.findOne({user_id:userId}).populate("user_id").populate("customer_id") .populate("items.vendor_id")
      .populate("items.product_id");
if (!cart) {
  return res.status(200).json({ cart: { items: [], subTotal:0, tax:0, discount:0, grandTotal:0 } });
}
    return res.status(200).json({ cart });
    }
        catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }

};
////update quantity
export const updateCartItemQty = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    const cart = await Cart.findOne({ user_id });
    if (!cart) return res.status(404).json({ message: "cart not found" });

    const itemIndex = cart.items.findIndex(
      (i) => i.product_id.toString() === product_id.toString()
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: "item not found in cart" });

    // remove if qty becomes 0
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
const item = cart.items[itemIndex];
  item.quantity = quantity;
  item.itemSubTotal = item.price * quantity;
  item.itemDiscount = (item.price - item.discountedPrice) * quantity;
  item.itemTotal = item.discountedPrice * quantity;
    }

    calculateTotals(cart);
    await cart.save();

    const populatedCart = await cart.populate("items.product_id");

    return res.status(200).json({
      message: quantity <= 0 ? "Item removed" : "Quantity updated",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};


//////remove sigle iten from the cart
export const removecartItem = async(req,res)=>{
    try{
     const {user_id,product_id} = req.params;
     const cart = await Cart.findOne({user_id:user_id});
     if(!cart){
        return res.status(404).json({message:"cart  not found"})
     }
     cart.items = cart.items.filter((i)=>i.product_id.toString()!==product_id.toString());
     calculateTotals(cart);
    await cart.save();

const populatedCart = await populateCart(cart);
return res.status(200).json({ message: "Item removed", cart: populatedCart });  
    }
     catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }

};
////clr cart
export const clearCart = async(req,res)=>{
    try{
      const {userId} =req.params;
      const cart = await Cart.findOne({user_id:userId });
      if(!cart){
        return res.status(404).json({message:"cart not found"});
      }
      cart.items = [];
    cart.subTotal = 0;
    cart.tax = 0;
    cart.discount = 0;
    cart.grandTotal = 0;
     await cart.save();
const populatedCart = await populateCart(cart);
return res.status(200).json({ message:"cart cleared", cart: populatedCart });    }
         catch(error){
        res.status(500).json({messsge:"server error",error:error.message});
    }

}



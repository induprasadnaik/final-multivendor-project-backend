import Wishlist from '../models/wishlist.js'

export const addwishlist = async(req,res)=>{
    try{
const userid= req.loggedUser._id;
const {productId} = req.body;
 const item = await Wishlist.create({
      user: userid,
      product: productId,
    });
   res.status(201).json({ message: "Added to wishlist", item }); 
    }
   catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}
};
/////delete wishlist
export const deletewishlist = async(req,res)=>{
    try{
 const userid = req.loggedUser._id
const {productId} = req.params;
 await Wishlist.findOneAndDelete({ user: userid, product: productId });
    
res.status(201).json({ message: "Removed from wishlist" });}
       catch(error){
         res.status(500).json({message:"Server error", error: error.message});   
}

};

///////get user wishlists

export const getWishlist = async (req, res) => {
  try {
    const userid = req.loggedUser._id;

    const wishlist = await Wishlist.find({ user: userid })
      .populate("product"); // sends full product data

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

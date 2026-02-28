import User from '../models/adminModel.js'
import Customer from '../../customer/models/customerModel.js'
import Vendor from '../../vendor/models/vendorModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

/////////setu admin
export const setupAdmin =async(req,res)=>{
    try{
const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check duplicate
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create first admin
    const admin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    return res.status(201).json({
      message: "First admin created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
    }
    catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//////register customer
export const registerCustomer = async (req, res) => {
  try {
    const { username, email, password, customerName, mobile, address } = req.body;

    if (!username || !email || !password || !customerName || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "customer",
    });

    const customer = await Customer.create({
      user_id: newUser._id,
      customerName,
      mobile,
      address,
    });

    res.status(201).json({ message: "Customer registered", user: newUser, customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/////register vendor
export const registerVendor = async (req, res) => {
  try {
    const { username, email, password, vendorName, shopName, mobile, address } = req.body;

    if (!username || !email || !password || !vendorName || !shopName || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "vendor", 
    });

    const vendor = await Vendor.create({
      user_id: newUser._id,
      shopName,
      vendorName,
      mobile,
      address,
    });

    res.status(201).json({ message: "Vendor registered.", user: newUser, vendor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
////////register admin
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username/Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin", 
    });

    res.status(201).json({ message: "Admin created", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/////login
export const loginUser =async(req,res)=>{
try{
        const {email,password} =req.body;
        if( !email || !password ){
           return res.status(400).json({message:"All fields are required"});          
        }
        //FIND USER
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({message:"Invalid Username/email"});
        }
        //check user //check blocked or not
if (!user.isActive) {
  return res.status(403).json({ message: "Account is blocked by admin" });
}

    //CHECK PASSWORD
    const matchedPassword= await bcrypt.compare(password,user.password);
    
     if(!matchedPassword){
       return res.status(400).json({message:"invalid password"});    
     }
if(user.role ==="vendor"){
    const vendor = await Vendor.findOne({ user_id: user._id });
    if (vendor.status !== "approved") {
    return res.status(403).json({ message: "Waiting for admin approval" });
  }
  }
     //update lastloginAt in Admin
    user.lastLoginAt = new Date();
    await user.save();
///update lastLoginAt in role wise

await Customer.findOneAndUpdate(
  { user_id: user._id },
  { lastLoginAt: new Date() },
  { new: true }
);
await Vendor.findOneAndUpdate(
  { user_id: user._id },
  { lastLoginAt: new Date() },
  { new: true }
);

     ///create jwt token
     const token = jwt.sign({id:user._id,username:user.username,role:user.role},process.env.SECRET,{expiresIn: process.env.EXPIRES_IN});
      //set token  in cookie
      res.cookie("token",token,{
     httpOnly: true,
    //  secure: false,
    //  sameSite: "lax",
    secure: true,        //// REQUIRED for production,
    sameSite: "none",     ////REQUIRED for cross-site cookies  
      }); 
     res.status(200).json({message:"login successful",token:token,user:{id:user._id,username:user.username,role:user.role,lastLoginAt: user.lastLoginAt}});
}
  catch(err){
        res.status(500).json({message:err.message});
}
};
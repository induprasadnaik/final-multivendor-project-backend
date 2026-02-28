import jwt from 'jsonwebtoken'
import User from '../modules/admin/models/adminModel.js'

export const authMiddleware = async(req,res,next)=>{
    try{

const token = req.cookies.token;
if(!token)
{
    return res.status(401).json({message:"Access denied. please login"})
}
const verifyToken = jwt.verify(token,process.env.SECRET);
const user = await User.findById(verifyToken.id);
if(!user){
    return res.status(401).json({ message: "User not found"});
}
req.loggedUser =user;
next();
    }
catch(err){
res.status(401).json({message:"Unauthorized"});
}

};
//rolewise authorize
export const authorizeRoles = (...roles)=>{
    return(req,res,next)=>{
         if (!req.loggedUser) {
      return res.status(401).json({ message: "Unauthorized" });
        }
       if(!roles.includes(req.loggedUser.role)){
        return res.status(403).json({
            message:"Access Denied "
        });
       } 
       next();
    };
}
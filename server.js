import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
/////socket
import http from "http";
import { Server } from "socket.io";
import {  setIO }  from "./socket.js";
/////
import mongoose from 'mongoose'
import connectDB from "./config/db.js"
import userRoutes from "./modules/admin/routes/userRoutes.js"
import adminRoutes from './modules/admin/routes/adminRoutes.js'
import customerRoutes from './modules/customer/routes/customerRoutes.js'
import cartRoutes from "./modules/customer/routes/cartRoutes.js"
import vendorRoutes from "./modules/vendor/routes/vendorRoutes.js"
import paymentRoutes from "./modules/payment/paymentRoutes.js"
import {authMiddleware,authorizeRoles} from './middlewares/authmiddleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
connectDB();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://final-multivendor-project-vercel-2xl7xigt1.vercel.app",
    credentials: true,
  },
});
setIO(io);
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinOrderRoom", (customerId) => {
    socket.join(customerId.toString());
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
export { io }; // make available to controllerss

app.use(cookieParser());
app.use(cors({
  origin:"https://final-multivendor-project-vercel.vercel.app/",
  credentials: true
}));
app.use(express.json());
app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/vendor",vendorRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/payment",paymentRoutes);
server.listen(process.env.PORT, () => {
  console.log(`Server + socket is running on port ${process.env.PORT}`);
});

/////,authMiddleware, authorizeRoles("vendor")

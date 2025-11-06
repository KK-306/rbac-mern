import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/rbac_extended";
mongoose.connect(MONGO_URI).then(()=>console.log("Mongo connected")).catch(console.error);

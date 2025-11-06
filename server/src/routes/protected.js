import { Router } from "express";
import { requireAuth, permit } from "../middleware/auth.js";
const router = Router();
router.get("/user", requireAuth, permit("user","manager","admin"), (req,res)=>res.json({message:"user zone"}));
router.get("/manager", requireAuth, permit("manager","admin"), (req,res)=>res.json({message:"manager zone"}));
router.get("/admin", requireAuth, permit("admin"), (req,res)=>res.json({message:"admin zone"}));
export default router;

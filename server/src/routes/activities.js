import { Router } from "express";
import Activity from "../models/Activity.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/", requireAuth, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { actorId: req.user.id };
  const items = await Activity.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json(items);
});
export default router;

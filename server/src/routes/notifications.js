import { Router } from "express";
import Notification from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/", requireAuth, async (req, res) => {
  const items = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
  res.json(items);
});
router.post("/:id/read", requireAuth, async (req,res)=>{
  await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { isRead: true });
  res.json({ ok: true });
});
router.post("/read-all", requireAuth, async (req,res)=>{
  await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
  res.json({ ok: true });
});
export default router;

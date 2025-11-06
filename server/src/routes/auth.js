import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const sign = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "2d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });
    const user = await User.create({ name, email, password, role: role || "user" });
    const token = sign({ id: user._id, role: user.role, email: user.email });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = sign({ id: user._id, role: user.role, email: user.email });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.get("/me", requireAuth, (req, res) => { res.json({ user: req.user }); });

export default router;

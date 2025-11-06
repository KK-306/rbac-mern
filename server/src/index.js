import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "./db.js";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import postRoutes from "./routes/posts.js";
import notificationRoutes from "./routes/notifications.js";
import activityRoutes from "./routes/activities.js";

dotenv.config();
const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server on", PORT));

import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["post_created","comment_added","post_liked"], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  meta: { type: Object, default: {} }
}, { timestamps: true });
export default mongoose.model("Notification", NotificationSchema);

import mongoose from "mongoose";
const ActivitySchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: String, required: true },
  meta: { type: Object, default: {} }
}, { timestamps: true });
export default mongoose.model("Activity", ActivitySchema);

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorName: String,
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorRole: { type: String, enum: ["admin","manager","user"], required: true },
  imageUrl: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [CommentSchema]
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);

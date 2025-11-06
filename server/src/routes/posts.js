import { Router } from "express";
import multer from "multer";
import path from "path";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";
import { requireAuth, permit } from "../middleware/auth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/../uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `img_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/", requireAuth, permit("admin","manager"), upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user.id,
      authorRole: req.user.role,
      imageUrl
    });
    await Notification.create({ userId: req.user.id, type: "post_created", message: `Your post "${post.title}" was created.`, meta: { postId: post._id } });
    await Activity.create({ actorId: req.user.id, action: "CREATE_POST", targetType: "post", targetId: post._id, meta: {} });
    res.status(201).json(post);
  } catch (e) { console.error(e); res.status(500).json({ message: "Error creating post" }); }
});

router.get("/", requireAuth, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.put("/:id", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (req.user.role === "manager" && post.authorId.toString() !== req.user.id) return res.status(403).json({ message: "Permission denied" });
  if (req.user.role === "user") return res.status(403).json({ message: "Users cannot edit" });
  post.title = req.body.title ?? post.title;
  post.content = req.body.content ?? post.content;
  await post.save();
  await Activity.create({ actorId: req.user.id, action: "EDIT_POST", targetType: "post", targetId: post._id, meta: {} });
  res.json(post);
});

router.delete("/:id", requireAuth, permit("admin"), async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  await Activity.create({ actorId: req.user.id, action: "DELETE_POST", targetType: "post", targetId: req.params.id, meta: {} });
  res.json({ message: "Post deleted" });
});

router.post("/:id/like", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const idx = post.likes.findIndex(u => u.toString() === req.user.id);
  let liked;
  if (idx === -1) { post.likes.push(req.user.id); liked = true; }
  else { post.likes.splice(idx, 1); liked = false; }
  await post.save();
  if (liked) {
    await Notification.create({ userId: post.authorId, type: "post_liked", message: `${req.user.name} liked your post "${post.title}"`, meta: { postId: post._id, likerId: req.user.id } });
  }
  await Activity.create({ actorId: req.user.id, action: "LIKE_POST", targetType: "post", targetId: post._id, meta: { liked } });
  res.json({ likes: post.likes.length, liked });
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const comment = { authorId: req.user.id, authorName: req.user.name, content: req.body.content };
  post.comments.unshift(comment);
  await post.save();
  await Notification.create({ userId: post.authorId, type: "comment_added", message: `${req.user.name} commented on your post "${post.title}"`, meta: { postId: post._id } });
  await Activity.create({ actorId: req.user.id, action: "COMMENT_POST", targetType: "post", targetId: post._id, meta: {} });
  res.status(201).json(post.comments[0]);
});

router.delete("/:postId/comments/:commentId", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (req.user.role !== "admin" && comment.authorId.toString() != req.user.id) return res.status(403).json({ message: "Not allowed" });
  comment.deleteOne();
  await post.save();
  await Activity.create({ actorId: req.user.id, action: "DELETE_COMMENT", targetType: "comment", targetId: req.params.commentId, meta: {} });
  res.json({ ok: true });
});

export default router;

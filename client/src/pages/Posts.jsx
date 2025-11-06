import { useEffect, useState } from "react";
import API from "../api";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <div className="card">Please login again.</div>;

  const fetchPosts = async () => {
    try { const { data } = await API.get("/posts"); setPosts(data); } catch (e) { setPosts([]); }
  };
  useEffect(()=>{ fetchPosts(); }, []);

  const createPost = async () => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      if (file) fd.append("image", file);
      await API.post("/posts", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm({ title:"", content:"" }); setFile(null); fetchPosts();
    } catch(e){ console.error(e); }
  };

  const updatePost = async () => {
    try {
      await API.put(`/posts/${editing}`, { title: form.title, content: form.content });
      setEditing(null); setForm({ title:"", content:"" }); fetchPosts();
    } catch(e){ console.error(e); }
  };

  const deletePost = async (id) => { try { await API.delete(`/posts/${id}`); fetchPosts(); } catch(e){ console.error(e); } };
  const toggleLike = async (id) => { try { await API.post(`/posts/${id}/like`); fetchPosts(); } catch(e){ console.error(e); } };
  const addComment = async (id, content) => {
    if (!content.trim()) return;
    try { await API.post(`/posts/${id}/comments`, { content }); fetchPosts(); } catch(e){ console.error(e); }
  };
  const deleteComment = async (postId, commentId) => { try { await API.delete(`/posts/${postId}/comments/${commentId}`); fetchPosts(); } catch(e){ console.error(e); } };

  return (
    <div>
      {(user.role === "admin" || user.role === "manager") && (
        <div className="card" style={{ marginBottom:"1rem" }}>
          <h3>{editing ? "✏️ Edit Post" : "📝 Create Post"}</h3>
          <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <textarea placeholder="Content" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} />
          {!editing && (<input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />)}
          <div className="row">
            <button className="btn" onClick={editing ? updatePost : createPost}>{editing ? "Update" : "Create"}</button>
            {editing && <button className="btn ghost" onClick={()=>{setEditing(null);setForm({title:"",content:""});}}>Cancel</button>}
          </div>
          <p className="notice">Managers can edit only their own posts. Only admins can delete posts.</p>
        </div>
      )}

      {posts.map(p => (
        <div key={p._id} className="card" style={{ marginBottom:"1rem" }}>
          <div className="row" style={{justifyContent:"space-between"}}>
            <div>
              <h3 style={{marginBottom:".25rem"}}>{p.title}</h3>
              <small className="tag">{p.authorRole}</small>
            </div>
            <div className="row" style={{gap:".5rem"}}>
              <span className="badge">👍 {p.likes?.length||0}</span>
              <span className="badge">💬 {p.comments?.length||0}</span>
            </div>
          </div>
          {p.imageUrl && <img className="post" src={`http://localhost:4000${p.imageUrl}`} alt="post" />}
          <p style={{whiteSpace:"pre-wrap"}}>{p.content}</p>

          <div className="row">
            <button className="btn secondary" onClick={()=>toggleLike(p._id)}>Like / Unlike</button>

            {(user.role !== "user" && (user.role === "admin" || p.authorId === user.id || p.authorId === user._id)) && (
              <button className="btn" onClick={()=>{ setEditing(p._id); setForm({ title: p.title, content: p.content }); }}>Edit</button>
            )}

            {user.role === "admin" && (
              <button className="btn danger" onClick={()=>deletePost(p._id)}>Delete</button>
            )}
          </div>

          <div style={{ marginTop:"1rem" }}>
            <h4>Comments</h4>
            <CommentBox onSubmit={(text)=>addComment(p._id, text)} />
            {p.comments?.map(c => (
              <div key={c._id} className="comment">
                <strong>{c.authorName||"User"}</strong>: {c.content}
                {(user.role==="admin" || c.authorId===user.id || c.authorId===user._id) && (
                  <button className="btn ghost" style={{marginLeft:"8px"}} onClick={()=>deleteComment(p._id,c._id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentBox({ onSubmit }){
  const [text, setText] = useState("");
  return (
    <div className="row">
      <input placeholder="Write a comment..." value={text} onChange={e=>setText(e.target.value)} />
      <button className="btn" onClick={()=>{ onSubmit(text); setText(""); }}>Comment</button>
    </div>
  );
}

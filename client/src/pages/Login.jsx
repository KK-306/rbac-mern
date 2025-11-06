import { useState } from "react";
import API from "../api";
export default function Login({ onAuth }){
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"user" });
  const [error, setError] = useState("");
  const submit = async (e)=>{
    e.preventDefault();
    try{ setError(""); const endpoint = tab==="login"? "/auth/login": "/auth/register"; const { data } = await API.post(endpoint, form); onAuth(data); }
    catch(err){ setError(err?.response?.data?.message || "Something went wrong"); }
  };
  return (<div className="card" style={{maxWidth:520, margin:"2rem auto"}}>
    <div className="row" style={{marginBottom:".75rem"}}>
      <button className={"btn " + (tab==="login"? "":"secondary")} onClick={()=>setTab("login")}>Login</button>
      <button className={"btn " + (tab==="register"? "":"secondary")} onClick={()=>setTab("register")}>Register</button>
    </div>
    <form onSubmit={submit} className="row" style={{flexDirection:"column", gap:".75rem"}}>
      {tab==="register" && <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />}
      <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
      {tab==="register" && (<select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}><option value="user">User</option><option value="manager">Manager</option><option value="admin">Admin</option></select>)}
      {error && <div className="tag" style={{borderColor:"#7a2a2a", background:"#3a1a1a", color:"#ffb1b1"}}>{error}</div>}
      <button className="btn" type="submit">{tab==="login" ? "Login" : "Create Account"}</button>
      <p className="notice">Tip: Create three accounts to explore roles.</p>
    </form></div>);
}

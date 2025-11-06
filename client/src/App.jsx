import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import Manager from "./pages/Manager.jsx";
import Profile from "./pages/Profile.jsx";
import Posts from "./pages/Posts.jsx";
import Notifications from "./pages/Notifications.jsx";
import Activity from "./pages/Activity.jsx";

function Protected({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App(){
  const [user, setUser] = useState(()=>{
    const u = localStorage.getItem("user"); return u? JSON.parse(u): null;
  });
  const navigate = useNavigate();
  const logout = ()=>{ localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); navigate("/login"); };
  useEffect(()=>{},[]);
  return (<div><Nav user={user} onLogout={logout}/><div className="container"><Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/login" element={<Login onAuth={(payload)=>{ localStorage.setItem("token", payload.token); localStorage.setItem("user", JSON.stringify(payload.user)); setUser(payload.user); navigate("/"); }} />}/>
    <Route path="/admin" element={<Protected roles={["admin"]}><Admin/></Protected>}/>
    <Route path="/manager" element={<Protected roles={["admin","manager"]}><Manager/></Protected>}/>
    <Route path="/profile" element={<Protected><Profile/></Protected>}/>
    <Route path="/posts" element={<Protected><Posts/></Protected>}/>
    <Route path="/notifications" element={<Protected><Notifications/></Protected>}/>
    <Route path="/activity" element={<Protected><Activity/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></div></div>);
}

import { useEffect, useState } from "react";
import API from "../api";
export default function Notifications(){
  const [items, setItems] = useState([]);
  const load = async ()=>{ const { data } = await API.get("/notifications"); setItems(data); };
  useEffect(()=>{ load(); }, []);
  const markAll = async ()=>{ await API.post("/notifications/read-all"); load(); };
  const mark = async (id)=>{ await API.post(`/notifications/${id}/read`); load(); };
  return (<div className="card"><h2>🔔 Notifications</h2><button className="btn secondary" onClick={markAll}>Mark all read</button><div style={{marginTop:"1rem"}}>{items.map(n=>(<div key={n._id} className="card" style={{marginTop:".5rem"}}><div className="row" style={{justifyContent:"space-between"}}><div><strong>{n.type}</strong> — {n.message}{!n.isRead && <span className="tag" style={{marginLeft:"8px"}}>new</span>}</div>{!n.isRead && <button className="btn ghost" onClick={()=>mark(n._id)}>Mark read</button>}</div></div>))}</div></div>);
}

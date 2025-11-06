import { useEffect, useState } from "react";
import API from "../api";
export default function Activity(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ (async()=>{ const { data } = await API.get("/activities"); setItems(data); })(); }, []);
  return (<div className="card"><h2>📜 Activity Log</h2><div>{items.map(a=>(<div key={a._id} className="card" style={{marginTop:".5rem"}}><div className="row" style={{justifyContent:"space-between"}}><div><strong>{a.action}</strong> on {a.targetType} — <span className="notice">{new Date(a.createdAt).toLocaleString()}</span></div><span className="tag">id: {a.targetId}</span></div></div>))}</div></div>);
}

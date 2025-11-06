import { Link } from "react-router-dom";
export default function Nav({ user, onLogout }){
  return (<nav className="nav"><strong>🔐 RBAC</strong><Link to="/">Dashboard</Link>{user && user.role==="admin" && <Link to="/admin">Admin</Link>}{user && (user.role==="manager"||user.role==="admin") && <Link to="/manager">Manager</Link>}<Link to="/posts">Posts</Link><Link to="/notifications">Notifications</Link><Link to="/activity">Activity</Link><div className="spacer"/>{!user? <Link to="/login" className="btn secondary">Login</Link>: <button className="btn danger" onClick={onLogout}>Logout</button>}</nav>);
}

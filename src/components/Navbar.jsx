import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast.info("Logged out");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        Student Task Manager
      </Link>

      <div className="nav-links">
        <Link to="/">Tasks</Link>
        <button className="btn btn-logout btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
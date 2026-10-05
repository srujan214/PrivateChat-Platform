import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="glass-strong rounded-3xl p-8 text-center shadow-glow max-w-md">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Welcome, {user?.displayName || user?.username} 💜
        </h1>
        <p className="text-soft/60 text-sm mb-6">
          Chat UI comes in Step 9.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/profile")}
            className="btn-cinema px-5 py-2.5 rounded-xl text-white font-semibold"
          >
            Profile
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-soft font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
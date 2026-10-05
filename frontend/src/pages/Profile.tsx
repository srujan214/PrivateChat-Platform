import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, MessageCircle, Save, Camera, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { chatService } from "../services/chatService";
import { mediaService } from "../services/mediaService";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(user);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatService.me().then((p) => {
      setProfile(p);
      setDisplayName(p.displayName || "");
      setBio(p.bio || "");
      setAvatarUrl(p.avatarUrl || "");
    }).catch(() => {});
  }, []);

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
      const res = await mediaService.upload(file);
      setAvatarUrl(res.url);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await chatService.updateProfile({
        displayName,
        bio,
        avatarUrl,
      });
      setProfile(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const initials = (profile?.displayName || profile?.username || "?")
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative h-screen overflow-y-auto" style={{ background: "#050210" }}>
      <div className="mesh-bg" />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-gradient">Your Space</h1>
            <button
              onClick={() => navigate("/chat")}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <MessageCircle size={20} />
            </button>
          </div>

          {/* Profile card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="shimmer-border rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: "rgba(20,12,32,0.65)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col items-center gap-5">
              <div className="relative">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadAvatar(f);
                    e.target.value = "";
                  }}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #7C4DFF, #FF8FB1, #B57EDC, #7C4DFF)",
                    filter: "blur(10px)",
                    opacity: 0.9,
                  }}
                />
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-32 h-32 rounded-full flex items-center justify-center font-bold text-white text-4xl border-4 border-[#050210] cursor-pointer overflow-hidden group"
                  style={{
                    background: avatarUrl
                      ? `url(${avatarUrl}) center/cover`
                      : "linear-gradient(135deg, #7C4DFF 0%, #FF8FB1 100%)",
                  }}
                >
                  {!avatarUrl && initials}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition">
                    {uploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <Camera size={28} className="text-white" />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gradient">
                  {profile?.displayName || profile?.username}
                </h2>
                <p className="text-soft/50 text-sm">@{profile?.username}</p>
                {profile?.bio && !editing && (
                  <p className="text-soft/75 text-sm mt-3 max-w-xs mx-auto">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/chat")}
              className="btn-cinema w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 text-[15px]"
            >
              <MessageCircle size={20} /> Go to Chat
            </button>

            <button
              onClick={() => setEditing((e) => !e)}
              className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-[15px] transition"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F5F0FF",
              }}
            >
              <UserIcon size={20} /> {editing ? "Cancel" : "Edit Profile"}
            </button>

            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 overflow-hidden"
              >
                <input
                  className="input-cinema w-full px-5 py-4 rounded-2xl text-soft"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                />
                <textarea
                  className="input-cinema w-full px-5 py-4 rounded-2xl resize-none text-soft"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell them something about you…"
                  rows={3}
                />
                <button
                  onClick={save}
                  disabled={saving}
                  className="btn-cinema w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {saving ? "Saving…" : "Save Changes"}
                </button>
              </motion.div>
            )}

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
              }}
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
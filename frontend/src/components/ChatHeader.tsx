import { motion } from "framer-motion";
import { Phone, Video, ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";

export default function ChatHeader({
  partner,
  connected,
  typing,
  onVideoCall,
  onVoiceCall,
}: {
  partner: User | null;
  connected: boolean;
  typing: boolean;
  onVideoCall: () => void;
  onVoiceCall: () => void;
}) {
  const navigate = useNavigate();
  const name = partner?.displayName || partner?.username || "Partner";
  const initial = name[0]?.toUpperCase() || "?";

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="safe-top relative z-20 px-3 sm:px-5 py-3 flex items-center gap-3 border-b border-white/5"
      style={{
        background: "rgba(10, 6, 20, 0.75)",
        backdropFilter: "blur(40px) saturate(180%)",
      }}
    >
      <button
        onClick={() => navigate("/profile")}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
      >
        <ArrowLeft size={22} />
      </button>

      {/* Avatar with animated ring */}
      <div className="relative shrink-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-0.5 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #7C4DFF, #FF8FB1, #B57EDC, #7C4DFF)",
            filter: "blur(5px)",
            opacity: 0.85,
          }}
        />
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg border-2 border-[#0a0612] overflow-hidden"
          style={{
            background:
              partner?.avatarUrl
                ? `url(${partner.avatarUrl}) center/cover`
                : "linear-gradient(135deg, #7C4DFF 0%, #FF8FB1 100%)",
          }}
        >
          {!partner?.avatarUrl && initial}
        </div>
        {connected && (
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-[2.5px] border-[#0a0612]"
            style={{ boxShadow: "0 0 12px rgba(74,222,128,1)" }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-white truncate text-[16px] tracking-tight">
          {name}
        </p>
        <p className="text-[12px] text-soft/60 mt-0.5">
          {typing ? (
            <span className="text-accent italic">typing…</span>
          ) : connected ? (
            "online"
          ) : (
            "offline"
          )}
        </p>
      </div>

      <HeaderIcon onClick={onVideoCall} title="Video call">
        <Video size={22} />
      </HeaderIcon>
      <HeaderIcon onClick={onVoiceCall} title="Voice call">
        <Phone size={22} />
      </HeaderIcon>
      <HeaderIcon onClick={() => navigate("/profile")} title="Profile">
        <MoreVertical size={22} />
      </HeaderIcon>
    </motion.div>
  );
}

function HeaderIcon({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className="w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </motion.button>
  );
}
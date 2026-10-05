import { motion } from "framer-motion";
import { Check, CheckCheck, Download } from "lucide-react";
import type { ChatMessage } from "../services/chatService";

export default function MessageBubble({
  msg,
  mine,
}: {
  msg: ChatMessage;
  mine: boolean;
}) {
  const time = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const isImage = msg.type === "IMAGE" && msg.mediaUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flex ${mine ? "justify-end" : "justify-start"} px-3 sm:px-5`}
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="max-w-[82%] sm:max-w-[70%] px-3.5 py-2.5 relative group"
        style={
          mine
            ? {
                background:
                  "linear-gradient(135deg, #7C4DFF 0%, #B57EDC 55%, #FF8FB1 100%)",
                borderRadius: "22px 22px 6px 22px",
                boxShadow:
                  "0 6px 24px rgba(124, 77, 255, 0.4), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                color: "white",
              }
            : {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(30px)",
                borderRadius: "22px 22px 22px 6px",
                color: "#F5F0FF",
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }
        }
      >
        {isImage && (
          <div className="rounded-xl overflow-hidden mb-2 -mx-1 -mt-1 relative">
            <img
              src={msg.mediaUrl}
              alt="media"
              className="max-w-full max-h-80 object-cover"
            />
            <a
              href={msg.mediaUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-2 rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
            >
              <Download size={14} className="text-white" />
            </a>
          </div>
        )}

        {msg.content && (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words pr-16">
            {msg.content}
          </p>
        )}

        <div
          className={`absolute bottom-1.5 right-2.5 flex items-center gap-1 text-[10px] ${
            mine ? "text-white/85" : "text-soft/55"
          }`}
        >
          <span>{time}</span>
          {mine && (
            <span className="ml-0.5">
              {msg.pending ? (
                <Check size={13} />
              ) : msg.readAt ? (
                <CheckCheck size={13} className="text-cyan-300" />
              ) : (
                <CheckCheck size={13} />
              )}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
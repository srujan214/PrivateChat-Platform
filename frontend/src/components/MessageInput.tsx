import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip } from "lucide-react";
import { mediaService } from "../services/mediaService";

export default function MessageInput({
  onSend,
  onTyping,
}: {
  onSend: (content: string, type?: any, mediaUrl?: string) => void;
  onTyping: () => void;
}) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value, "TEXT");
    setText("");
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const res = await mediaService.upload(file);
      onSend("", "IMAGE", res.url);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="safe-bottom relative z-20 px-3 sm:px-5 pb-3 pt-2 border-t border-white/5"
      style={{
        background: "rgba(10, 6, 20, 0.75)",
        backdropFilter: "blur(40px) saturate(180%)",
      }}
    >
      <div
        className="rounded-3xl px-2 py-1.5 flex items-end gap-1.5 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => fileRef.current?.click()}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white shrink-0"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {uploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <Paperclip size={20} />
          )}
        </motion.button>

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Message..."
          className="flex-1 bg-transparent outline-none px-3 py-3 text-[15px] text-white placeholder-white/40"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={submit}
          disabled={!text.trim()}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white disabled:opacity-30 shrink-0"
          style={{
            background: text.trim()
              ? "linear-gradient(135deg, #7C4DFF 0%, #FF8FB1 100%)"
              : "rgba(255,255,255,0.05)",
            boxShadow: text.trim()
              ? "0 0 30px rgba(124,77,255,0.7), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "none",
            transition: "all 0.3s ease",
          }}
        >
          <Send size={22} />
        </motion.button>
      </div>
    </motion.div>
  );
}
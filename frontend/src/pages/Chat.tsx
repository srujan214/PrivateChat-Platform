import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useWebRTC } from "../hooks/useWebRTC";
import { chatService, type ChatMessage } from "../services/chatService";
import { playMessageSound } from "../utils/sound";
import { getPartnerUsername } from "../utils/partner";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";
import VideoCallOverlay from "../components/VideoCallOverlay";
import type { User } from "../types";

export default function Chat() {
  const { user } = useAuth();
  useNavigate(); // keep hook count stable
  const PARTNER_USERNAME = getPartnerUsername(user?.username);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partner, setPartner] = useState<User | null>(null);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const scrollRef = useAutoScroll<HTMLDivElement>([
    messages.length,
    partnerTyping,
  ]);

  useEffect(() => {
    if (!user || !PARTNER_USERNAME) return;
    chatService
      .history(PARTNER_USERNAME)
      .then((l) => setMessages(l.reverse()))
      .catch(() => {});
    chatService
      .getByUsername(PARTNER_USERNAME)
      .then(setPartner)
      .catch(() => {});
  }, [user, PARTNER_USERNAME]);

  const { connected, send } = useWebSocket({
    onMessage: (msg: ChatMessage) => {
      if (msg.senderUsername !== user?.username) playMessageSound();
      setMessages((prev) => {
        const cleaned = prev.filter(
          (m) =>
            !(
              m.pending &&
              m.content === msg.content &&
              m.senderUsername === msg.senderUsername
            )
        );
        return [...cleaned, msg];
      });
    },
    onTyping: (e: any) => {
      if (e.from === PARTNER_USERNAME) setPartnerTyping(e.typing);
    },
    onWebRTC: (msg: any) => rtc.handleSignal(msg),
  });

  const rtc = useWebRTC({
    partnerUsername: PARTNER_USERNAME,
    send,
    onRemoteStream: setRemoteStream,
  });

  const handleSend = (
    content: string,
    type: any = "TEXT",
    mediaUrl?: string
  ) => {
    if (!user) return;
    const optimistic: ChatMessage = {
      senderUsername: user.username,
      receiverUsername: PARTNER_USERNAME,
      content,
      type,
      mediaUrl,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    send("/app/chat.send", optimistic);
  };

  const isMine = (m: ChatMessage) => m.senderUsername === user?.username;

  return (
    <div
      className="relative h-screen flex flex-col"
      style={{ background: "#050210" }}
    >
      <div className="mesh-bg" />

      <ChatHeader
        partner={partner}
        connected={connected}
        typing={partnerTyping}
        onVideoCall={() => rtc.startCall(true)}
        onVoiceCall={() => rtc.startCall(false)}
      />

      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto py-5 space-y-2.5"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-accent"
              style={{
                filter:
                  "drop-shadow(0 0 30px rgba(255,143,177,0.9)) drop-shadow(0 0 60px rgba(255,143,177,0.5))",
              }}
            >
              <Heart size={72} fill="currentColor" />
            </motion.div>
            <p className="text-soft/60 text-sm tracking-widest uppercase">
              Say hi 💜
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <MessageBubble key={m.id || i} msg={m} mine={isMine(m)} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {partnerTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 px-3 sm:px-5"
            >
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MessageInput
        onSend={handleSend}
        onTyping={() =>
          send("/app/chat.typing", { to: PARTNER_USERNAME, typing: true })
        }
      />

      <VideoCallOverlay
        inCall={rtc.inCall}
        incoming={rtc.incoming}
        micOn={rtc.micOn}
        camOn={rtc.camOn}
        videoMode={rtc.videoMode}
        callState={rtc.callState}
        localStream={rtc.localStream}
        remoteStream={remoteStream}
        partnerName={partner?.displayName || partner?.username || "Partner"}
        onAccept={rtc.acceptCall}
        onDecline={rtc.declineCall}
        onEnd={rtc.endCall}
        onToggleMic={rtc.toggleMic}
        onToggleCam={rtc.toggleCam}
        onSwitchCamera={rtc.switchCamera}
      />
    </div>
  );
}
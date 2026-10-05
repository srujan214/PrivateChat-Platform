import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Phone,
  Camera,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";

function VideoTag({
  stream,
  muted = false,
  mirror = false,
  className = "",
}: {
  stream: MediaStream | null;
  muted?: boolean;
  mirror?: boolean;
  className?: string;
}) {
  const setRef = (el: HTMLVideoElement | null) => {
    if (!el) return;
    if (el.srcObject !== stream) el.srcObject = stream;
    if (stream) {
      const p = () => el.play().catch(() => {});
      p();
      setTimeout(p, 200);
      setTimeout(p, 800);
    }
  };
  return (
    <video
      ref={setRef}
      autoPlay
      playsInline
      muted={muted}
      className={className}
      style={{
        transform: mirror ? "scaleX(-1)" : undefined,
        objectFit: "cover",
      }}
    />
  );
}

export default function VideoCallOverlay({
  inCall,
  incoming,
  micOn,
  camOn,
  videoMode,
  callState,
  localStream,
  remoteStream,
  partnerName,
  onAccept,
  onDecline,
  onEnd,
  onToggleMic,
  onToggleCam,
  onSwitchCamera,
}: any) {
  const [speakerOn, setSpeakerOn] = useState(true);

  return (
    <>
      {/* Incoming */}
      <AnimatePresence>
        {incoming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{
              background:
                "radial-gradient(circle at center, rgba(124,77,255,0.35), rgba(5,2,16,0.95))",
              backdropFilter: "blur(30px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative rounded-[36px] p-10 text-center max-w-sm w-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(181,126,220,0.18), rgba(124,77,255,0.08))",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(40px)",
                boxShadow: "0 30px 100px rgba(124,77,255,0.6)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[0, 0.5, 1].map((d, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 2.5, 3.5], opacity: [0.5, 0.2, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: d }}
                    className="absolute w-24 h-24 rounded-full border-2 border-primary"
                  />
                ))}
              </div>

              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5"
                style={{ boxShadow: "0 0 60px rgba(181,126,220,0.9)" }}
              >
                <span className="text-white text-4xl font-bold">
                  {partnerName[0]?.toUpperCase()}
                </span>
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-1">
                {partnerName}
              </h3>
              <p className="text-soft/70 text-sm mb-8">
                {incoming.video !== false
                  ? "Video call incoming…"
                  : "Voice call incoming…"}
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={onDecline}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2"
                  style={{ boxShadow: "0 10px 30px rgba(239,68,68,0.6)" }}
                >
                  <PhoneOff size={22} /> Decline
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={onAccept}
                  className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-semibold flex items-center justify-center gap-2"
                  style={{ boxShadow: "0 10px 30px rgba(34,197,94,0.6)" }}
                >
                  <Phone size={22} /> Accept
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active call */}
      <AnimatePresence>
        {inCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black overflow-hidden"
          >
            {/* VIDEO MODE */}
            {videoMode && (
              <>
                <VideoTag
                  stream={remoteStream}
                  className="absolute inset-0 w-full h-full"
                />

                {(!remoteStream || callState !== "connected") && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0612] to-[#050210]">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6"
                        style={{ boxShadow: "0 0 80px rgba(181,126,220,0.8)" }}
                      >
                        <span className="text-5xl font-bold text-white">
                          {partnerName[0]?.toUpperCase()}
                        </span>
                      </motion.div>
                      <p className="text-soft/70 text-sm mb-4">
                        {callState === "calling"
                          ? "Ringing…"
                          : callState === "connecting"
                          ? "Connecting…"
                          : "Waiting for video…"}
                      </p>
                      <div className="flex justify-center gap-2">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className="w-2.5 h-2.5 rounded-full bg-primary"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 pointer-events-none" />

                {/* Header */}
                <div
                  className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10"
                  style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-2 rounded-full"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full bg-green-400"
                      style={{ boxShadow: "0 0 10px rgba(74,222,128,1)" }}
                    />
                    <span className="text-white font-semibold text-sm">
                      {partnerName}
                    </span>
                  </div>
                  <div
                    className="text-white/80 text-xs px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Local PiP */}
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.15}
                  className="absolute top-24 right-4 w-28 h-40 sm:w-40 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/25 shadow-2xl z-10 bg-black cursor-grab active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                >
                  <VideoTag stream={localStream} muted mirror className="w-full h-full" />
                  {!camOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <VideoOff className="text-white/70" size={32} />
                    </div>
                  )}
                </motion.div>

                {/* Controls */}
                <div
                  className="absolute bottom-0 left-0 right-0 pb-6 pt-3 px-4 flex justify-center gap-3 z-10"
                  style={{
                    paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
                  }}
                >
                  <ControlBtn
                    onClick={onToggleMic}
                    active={micOn}
                    icon={micOn ? <Mic size={24} /> : <MicOff size={24} />}
                  />
                  <ControlBtn
                    onClick={onSwitchCamera}
                    active
                    icon={<Camera size={24} />}
                  />
                  <ControlBtn
                    onClick={onEnd}
                    danger
                    icon={<PhoneOff size={26} />}
                    big
                  />
                  <ControlBtn
                    onClick={onToggleCam}
                    active={camOn}
                    icon={camOn ? <Video size={24} /> : <VideoOff size={24} />}
                  />
                  <ControlBtn
                    onClick={() => setSpeakerOn((s) => !s)}
                    active={speakerOn}
                    icon={speakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  />
                </div>
              </>
            )}

            {/* VOICE MODE */}
            {!videoMode && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-between py-16"
                style={{
                  background:
                    "linear-gradient(160deg, #0a0612 0%, #1a0f2e 60%, #2a1535 100%)",
                }}
              >
                <div />
                <div className="text-center">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 40px rgba(124,77,255,0.5)",
                        "0 0 120px rgba(255,143,177,0.9)",
                        "0 0 40px rgba(124,77,255,0.5)",
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="relative w-44 h-44 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8"
                  >
                    <span className="text-6xl font-bold text-white">
                      {partnerName[0]?.toUpperCase()}
                    </span>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {partnerName}
                  </h2>
                  <p className="text-soft/60 text-sm">
                    {callState === "connected"
                      ? "Connected"
                      : callState === "calling"
                      ? "Ringing…"
                      : "Connecting…"}
                  </p>
                </div>
                <div className="flex justify-center gap-5">
                  <ControlBtn
                    onClick={onToggleMic}
                    active={micOn}
                    icon={micOn ? <Mic size={26} /> : <MicOff size={26} />}
                  />
                  <ControlBtn
                    onClick={onEnd}
                    danger
                    icon={<PhoneOff size={28} />}
                    big
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ControlBtn({
  onClick,
  icon,
  active = false,
  danger = false,
  big = false,
}: any) {
  const size = big ? "w-16 h-16 sm:w-18 sm:h-18" : "w-14 h-14";
  const bg = danger
    ? "linear-gradient(135deg, #ef4444, #dc2626)"
    : active
    ? "rgba(255,255,255,0.15)"
    : "rgba(239,68,68,0.3)";

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`${size} rounded-full flex items-center justify-center text-white`}
      style={{
        background: bg,
        backdropFilter: "blur(30px)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: danger
          ? "0 10px 40px rgba(239,68,68,0.7)"
          : "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      {icon}
    </motion.button>
  );
}
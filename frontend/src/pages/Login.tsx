import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Lock, User, KeyRound, ArrowRight } from "lucide-react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import CinematicCursor from "../components/CinematicCursor";
import ParticleField from "../components/ParticleField";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // ---------- 3D TILT ----------
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 20,
  });

  const glowX = useSpring(useTransform(mx, [-0.5, 0.5], [0, 100]), {
    stiffness: 150,
    damping: 20,
  });
  const glowY = useSpring(useTransform(my, [-0.5, 0.5], [0, 100]), {
    stiffness: 150,
    damping: 20,
  });

  const bgGlow = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}% ${y}%, rgba(181,126,220,0.18), transparent 40%)`
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // ---------- SUBMIT ----------
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res =
        mode === "login"
          ? await authService.login(username, password)
          : await authService.register(username, password, displayName);

      login(res.token, res.user);

      const duration = 2200;
      const end = Date.now() + duration;
      const colors = ["#B57EDC", "#FF8FB1", "#F5F0FF", "#FFFFFF"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      confetti({
        particleCount: 220,
        spread: 130,
        startVelocity: 48,
        origin: { y: 0.6 },
        colors,
        scalar: 1.2,
      });

      setTimeout(() => navigate("/chat"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    // hook count stability
  }, []);

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden noise">
      <div className="aurora-bg" />
      <ParticleField />
      <CinematicCursor />

      {/* Floating hearts */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-accent/15 pointer-events-none z-[1]"
          initial={{ y: "110vh", x: `${Math.random() * 100}vw` }}
          animate={{ y: "-10vh", rotate: [0, 25, -12, 0] }}
          transition={{
            duration: 18 + Math.random() * 12,
            repeat: Infinity,
            delay: i * 2.2,
            ease: "linear",
          }}
        >
          <Heart size={16 + Math.random() * 34} fill="currentColor" />
        </motion.div>
      ))}

      {/* Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1200,
        }}
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <motion.div
          style={{ backgroundImage: bgGlow }}
          className="absolute -inset-8 rounded-[3rem] pointer-events-none blur-2xl"
        />

        <div className="shimmer-border glass-strong rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.75, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 bg-primary/50 blur-3xl rounded-full"
                />
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative bg-gradient-to-br from-primary via-accent to-primary p-4 rounded-2xl shadow-glow"
                >
                  <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-black text-center text-gradient tracking-tight mb-3"
              style={{ transform: "translateZ(30px)" }}
            >
              Private Space
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-center text-soft/50 text-sm mb-10 flex items-center justify-center gap-2 font-medium"
            >
              <Sparkles size={14} className="text-accent" />
              For favorite people only
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="relative flex gap-1 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-8"
            >
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className="relative flex-1 py-2.5 text-sm font-semibold rounded-xl z-10 transition-colors duration-300"
                >
                  {mode === m && (
                    <motion.div
                      layoutId="mode-bg"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl shadow-glow"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span
                    className={`relative z-10 capitalize ${
                      mode === m ? "text-white" : "text-soft/50"
                    }`}
                  >
                    {m}
                  </span>
                </button>
              ))}
            </motion.div>

            <form onSubmit={submit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="relative">
                      <User
                        size={18}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                          focused === "display" ? "text-primary" : "text-soft/30"
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        onFocus={() => setFocused("display")}
                        onBlur={() => setFocused(null)}
                        className="input-cinema w-full pl-12 pr-4 py-3.5 rounded-xl text-soft placeholder-soft/30"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants} className="relative">
                <User
                  size={18}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    focused === "username" ? "text-primary" : "text-soft/30"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused(null)}
                  required
                  className="input-cinema w-full pl-12 pr-4 py-3.5 rounded-xl text-soft placeholder-soft/30"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <KeyRound
                  size={18}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    focused === "password" ? "text-primary" : "text-soft/30"
                  }`}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                  className="input-cinema w-full pl-12 pr-4 py-3.5 rounded-xl text-soft placeholder-soft/30"
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="text-accent text-sm text-center font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                type="submit"
                className="btn-cinema w-full py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 group"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {mode === "login" ? "Enter Our Space" : "Create Our Space"}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            <motion.p
              variants={itemVariants}
              className="text-center text-soft/30 text-xs mt-6 font-medium tracking-wide"
            >
              Crafted with 💜 for two
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
      <div
        className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-primary animate-pulse-soft"
        style={{ animationDelay: "1s" }}
      />
    </div>
  );
}
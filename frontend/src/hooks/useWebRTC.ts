import { useCallback, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

export interface SignalMessage {
  from: string;
  to: string;
  type: "offer" | "answer" | "candidate" | "hangup";
  payload: any;
  video?: boolean;
}

interface Options {
  partnerUsername: string;
  send: (dest: string, body: any) => void;
  onRemoteStream: (stream: MediaStream | null) => void;
}

const ICE = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:global.stun.twilio.com:3478" },
];

export function useWebRTC({ partnerUsername, send, onRemoteStream }: Options) {
  const [inCall, setInCall] = useState(false);
  const [incoming, setIncoming] = useState<SignalMessage | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [videoMode, setVideoMode] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<
    "idle" | "calling" | "connecting" | "connected"
  >("idle");

  const localRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const pendingCandidates = useRef<any[]>([]);
  const videoModeRef = useRef(true);

  const getMedia = async (withVideo: boolean) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error(
        "Camera/Mic need HTTPS. Open the Cloudflare Tunnel URL (https://...) or localhost."
      );
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: withVideo
        ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
        : false,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    localRef.current = stream;
    setLocalStream(stream);
    setVideoMode(withVideo);
    videoModeRef.current = withVideo;
    setCamOn(withVideo);
    return stream;
  };

  const createPeer = (initiator: boolean, stream: MediaStream) => {
    const peer = new Peer({
      initiator,
      trickle: true,
      stream,
      config: { iceServers: ICE },
    });

    peer.on("signal", (data: any) => {
      send("/app/webrtc.signal", {
        to: partnerUsername,
        type:
          data.type === "offer"
            ? "offer"
            : data.type === "answer"
            ? "answer"
            : "candidate",
        payload: data,
        video: videoModeRef.current,
      });
    });

    peer.on("connect", () => {
      console.log("[WebRTC] connected");
      setCallState("connected");
      pendingCandidates.current.forEach((c) => {
        try {
          peer.signal(c);
        } catch {}
      });
      pendingCandidates.current = [];
    });

    peer.on("stream", (remote) => {
      console.log("[WebRTC] remote stream");
      onRemoteStream(remote);
      setCallState("connected");
    });

    peer.on("track", (_t, remote) => {
      onRemoteStream(remote);
    });

    peer.on("close", () => cleanup());
    peer.on("error", (e) => console.error("[WebRTC] error", e));

    peerRef.current = peer;
    return peer;
  };

  const cleanup = useCallback(() => {
    try {
      peerRef.current?.destroy();
    } catch {}
    peerRef.current = null;
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    pendingCandidates.current = [];
    setLocalStream(null);
    onRemoteStream(null);
    setInCall(false);
    setIncoming(null);
    setCallState("idle");
  }, [onRemoteStream]);

  const startCall = useCallback(
    async (withVideo = true) => {
      try {
        setCallState("calling");
        videoModeRef.current = withVideo;
        const stream = await getMedia(withVideo);
        createPeer(true, stream);
        setInCall(true);
      } catch (e: any) {
        console.error(e);
        alert(e.message || "Failed to start call");
        setCallState("idle");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [partnerUsername]
  );

  const acceptCall = useCallback(async () => {
    if (!incoming) return;
    try {
      setCallState("connecting");
      const withVideo = incoming.video !== false;
      videoModeRef.current = withVideo;
      const stream = await getMedia(withVideo);
      const peer = createPeer(false, stream);
      peer.signal(incoming.payload);
      setIncoming(null);
      setInCall(true);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to accept");
      cleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming]);

  const declineCall = useCallback(() => {
    if (!incoming) return;
    send("/app/webrtc.signal", {
      to: partnerUsername,
      type: "hangup",
      payload: {},
    });
    setIncoming(null);
    setCallState("idle");
  }, [incoming, partnerUsername, send]);

  const endCall = useCallback(() => {
    send("/app/webrtc.signal", {
      to: partnerUsername,
      type: "hangup",
      payload: {},
    });
    cleanup();
  }, [partnerUsername, send, cleanup]);

  const handleSignal = useCallback(
    (msg: SignalMessage) => {
      console.log("[WebRTC] signal:", msg.type);
      if (msg.type === "hangup") {
        cleanup();
        return;
      }
      if (msg.type === "offer") {
        setIncoming(msg);
        setCallState("calling");
        return;
      }
      if (msg.type === "answer" || msg.type === "candidate") {
        if (!peerRef.current) {
          if (msg.type === "candidate") pendingCandidates.current.push(msg.payload);
          return;
        }
        try {
          peerRef.current.signal(msg.payload);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [cleanup]
  );

  const toggleMic = () => {
    const t = localRef.current?.getAudioTracks()[0];
    if (t) {
      t.enabled = !t.enabled;
      setMicOn(t.enabled);
    }
  };

  const toggleCam = () => {
    const t = localRef.current?.getVideoTracks()[0];
    if (t) {
      t.enabled = !t.enabled;
      setCamOn(t.enabled);
    }
  };

  const switchCamera = async () => {
    const stream = localRef.current;
    if (!stream) return;
    const currentTrack = stream.getVideoTracks()[0];
    const facing = currentTrack?.getSettings().facingMode;
    const next = facing === "user" ? "environment" : "user";
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next },
        audio: false,
      });
      const newTrack = newStream.getVideoTracks()[0];
      const pc = (peerRef.current as any)?._pc as RTCPeerConnection | undefined;
      const sender = pc?.getSenders().find((s) => s.track?.kind === "video");
      if (sender && newTrack) await sender.replaceTrack(newTrack);
      currentTrack && stream.removeTrack(currentTrack);
      stream.addTrack(newTrack);
      setLocalStream(new MediaStream(stream.getTracks()));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inCall,
    incoming,
    micOn,
    camOn,
    videoMode,
    callState,
    localStream,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    handleSignal,
    toggleMic,
    toggleCam,
    switchCamera,
  };
}
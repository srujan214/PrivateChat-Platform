import { useEffect, useRef, useState, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL } from "../services/api";

interface Options {
  onMessage?: (msg: any) => void;
  onTyping?: (e: any) => void;
  onRead?: (e: any) => void;
  onPresence?: (e: any) => void;
  onWebRTC?: (e: any) => void;
}

export function useWebSocket(options: Options = {}) {
  const clientRef = useRef<Client | null>(null);
  const handlersRef = useRef(options);
  handlersRef.current = options;
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
    });

    client.onConnect = () => {
      setConnected(true);
      client.subscribe("/user/queue/messages", (m: IMessage) =>
        handlersRef.current.onMessage?.(JSON.parse(m.body))
      );
      client.subscribe("/user/queue/typing", (m: IMessage) =>
        handlersRef.current.onTyping?.(JSON.parse(m.body))
      );
      client.subscribe("/user/queue/read", (m: IMessage) =>
        handlersRef.current.onRead?.(JSON.parse(m.body))
      );
      client.subscribe("/user/queue/webrtc", (m: IMessage) =>
        handlersRef.current.onWebRTC?.(JSON.parse(m.body))
      );
      client.subscribe("/topic/presence", (m: IMessage) =>
        handlersRef.current.onPresence?.(JSON.parse(m.body))
      );
    };

    client.onDisconnect = () => setConnected(false);
    client.onWebSocketClose = () => setConnected(false);
    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const send = useCallback((dest: string, body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: dest,
        body: JSON.stringify(body),
      });
    }
  }, []);

  return { connected, send };
}
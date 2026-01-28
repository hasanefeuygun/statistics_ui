"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";

type ConnectionState = "connecting" | "connected" | "disconnected";

type SocketContextType = {
  socket: Socket | null;
  connectionState: ConnectionState;
  startFlow: () => void;
  stopFlow: () => void;
};

type StatsContextType = {
  statsValue: number | null;
  lastUpdate: number | null;
};

type NumbersTickPayload = {
  value: number;
  at: number;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectionState: "connecting",
  startFlow: () => {},
  stopFlow: () => {},
});

const StatsContext = createContext<StatsContextType>({
  statsValue: null,
  lastUpdate: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const [socket] = useState<Socket | null>(() => {
    console.log("socket created");
    return io(url, {
      reconnectionAttempts: 5,
    });
  });

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");

  const [lastUpdate, setlastUpdate] = useState<number | null>(null);
  const [statsValue, setStatsValue] = useState<number | null>(null);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setConnectionState("connected");
    const onDisconnect = () => setConnectionState("disconnected");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("server:stats", (data: NumbersTickPayload) => {
      const { value, at } = data;
      setlastUpdate(Date.now() - new Date(at).getTime());
      setStatsValue(value);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("server:stats");
      socket.disconnect();
    };
  }, [socket]);

  //One function ref is going to created
  const startFlow = useCallback(() => {
    socket?.emit("subscribe");
  }, [socket]);

  const stopFlow = useCallback(() => {
    socket?.emit("unsubscribe");
  }, [socket]);

  const SocketContextValue = useMemo(
    () => ({ socket, connectionState, startFlow, stopFlow }),
    [socket, connectionState, startFlow, stopFlow],
  );
  const StatsContextValue = useMemo(
    () => ({
      statsValue,
      lastUpdate,
    }),
    [statsValue, lastUpdate],
  );

  return (
    <SocketContext.Provider value={SocketContextValue}>
      <StatsContext.Provider value={StatsContextValue}>
        {children}
      </StatsContext.Provider>
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export function useStats() {
  return useContext(StatsContext);
}

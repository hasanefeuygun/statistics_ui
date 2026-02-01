"use client";
import { createContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

type DataFlowStateType = "started" | "stopped";
type ConnectionStatusType = "connected" | "disconnected" | "connecting";
interface ServerConnectionPayload {
  connectionStatus: ConnectionStatusType;
}
interface ServerStatsPayload {
  value: number;
  at: number;
}

interface SocketContextType {
  statsHistory: number[];
  dataFlowState: DataFlowStateType;
  connectionState: ConnectionStatusType;
  lastUpdate: number | null;
  handleDataFlow: () => void;
  connectionErrorMessage: string | null;
  statsLoading: boolean;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [statsHistory, setStatsHistory] = useState<number[]>([]);

  const [dataFlowState, setDataFlowState] =
    useState<DataFlowStateType>("stopped");

  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");

  const [lastUpdate, setlastUpdate] = useState<number | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const [connectionErrorMessage, setConnectionErrorMessage] = useState<
    string | null
  >(null);

  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("server:connection", (data: ServerConnectionPayload) => {
      setConnectionState(data.connectionStatus);
    });

    socket.on("server:stats", (data: ServerStatsPayload) => {
      setlastUpdate(Date.now() - new Date(data.at).getTime());
      setStatsHistory((prev) => [...prev, data.value].slice(-1000));
      setStatsLoading(false);
    });

    socket.on("connect_error", (error) =>
      setConnectionErrorMessage(
        error.message === "xhr poll error"
          ? "Are you sure backend file is running?"
          : error.message,
      ),
    );
  }, []);

  const handleDataFlow = () => {
    if (dataFlowState === "stopped") {
      socketRef.current?.emit("subscribe");
      setDataFlowState("started");
    } else if (dataFlowState === "started") {
      socketRef.current?.emit("unsubscribe");
      setDataFlowState("stopped");
    }
  };

  return (
    <SocketContext.Provider
      value={{
        statsLoading,
        statsHistory,
        dataFlowState,
        connectionState,
        lastUpdate,
        handleDataFlow,
        connectionErrorMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

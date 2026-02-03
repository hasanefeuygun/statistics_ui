"use client";
import { createContext, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { z } from "zod";

const RE_CONNECTION_ATTEMPTS = 5;
const NUMBER_RANGE = 10;

type ConnectionStatusType =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

type DataFlowStateType = "started" | "stopped";

const ServerStatsSchema = z.object({
  value: z.number().int().max(NUMBER_RANGE),
  at: z.number().int(),
});

interface SocketContextType {
  dataFlowState: DataFlowStateType;
  connectionState: ConnectionStatusType;
  lastUpdate: number | null;
  handleDataFlow: () => void;
  connectionErrorMessage: string | null;
  statsLoading: boolean;
  reconnectAttempt: number;
  total: number;
  counts: number[];
}

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [dataFlowState, setDataFlowState] =
    useState<DataFlowStateType>("stopped");
  const [connectionState, setConnectionState] =
    useState<ConnectionStatusType>("connecting");
  const [lastUpdate, setlastUpdate] = useState<number | null>(null);
  const [connectionErrorMessage, setConnectionErrorMessage] = useState<
    string | null
  >(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [counts, setCounts] = useState<number[]>(() =>
    Array(NUMBER_RANGE + 1).fill(0),
  );

  const socketRef = useRef<Socket | null>(null);

  function onNewValue(value: number) {
    if (value < 1 || value > NUMBER_RANGE) return;

    setCounts((prev) => {
      const next = [...prev];
      next[value] += 1;
      return next;
    });

    setTotal((t) => t + 1);
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      reconnectionAttempts: RE_CONNECTION_ATTEMPTS,
      reconnection: true,
      timeout: 5000,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionState("connected");
      setConnectionErrorMessage(null);
      setReconnectAttempt(0);
    });

    socket.on("disconnect", (reason) => {
      setConnectionState("reconnecting");
      setConnectionErrorMessage(`Disconnected: ${reason}. Reconnecting...`);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      setConnectionState("reconnecting");
      setReconnectAttempt(attempt);
      setConnectionErrorMessage(
        `Reconnecting… (${attempt}/${RE_CONNECTION_ATTEMPTS})`,
      );
    });

    socket.io.on("reconnect", () => {
      setConnectionState("connected");
      setConnectionErrorMessage(null);
      setReconnectAttempt(0);
    });

    socket.io.on("reconnect_failed", () => {
      setConnectionState("disconnected");
      setConnectionErrorMessage(
        `Reconnection failed after ${RE_CONNECTION_ATTEMPTS} attempts.Are you sure that backend file is running ?`,
      );
      setReconnectAttempt(RE_CONNECTION_ATTEMPTS);
      setDataFlowState("stopped");
    });

    socket.on("server:stats", (raw: unknown) => {
      const parsed = ServerStatsSchema.safeParse(raw);

      if (!parsed.success) {
        setConnectionErrorMessage("Invalid stats payload recieved from server");
        return;
      }

      const data = parsed.data;

      onNewValue(data.value);
      setlastUpdate(Date.now() - new Date(data.at).getTime());
      setStatsLoading(false);
    });

    socket.on("connect_error", (error) => {
      setConnectionErrorMessage(
        error.message === "xhr poll error"
          ? "Cannot reach backend."
          : error.message,
      );
    });

    return () => {
      socket.io.removeAllListeners();
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
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
        dataFlowState,
        connectionState,
        lastUpdate,
        handleDataFlow,
        connectionErrorMessage,
        reconnectAttempt,
        total,
        counts,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

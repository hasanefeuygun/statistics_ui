"use client";

import { Socket } from "socket.io-client";
import {
  ConnectionStatusType,
  SocketProvider,
} from "../providers/socket-provider";
import { useState, useEffect, useRef } from "react";
export default function TemporaryPage() {
  const [connectionState, setConnectionState] = useState<
    "connected" | "disconnected" | null
  >(null);

  const [dataFlowState, setDataFlowState] = useState<
    "started" | "stopped" | null
  >(null);

  const [lastUpdate, setlastUpdate] = useState<number | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const SocketProviderRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket: Socket | null = SocketProvider.openSocket();

    socket?.on("server:connection", (data: ConnectionStatusType) => {
      console.log(data.connectionStatus);
    });
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <span>Test Page</span>
    </div>
  );
}

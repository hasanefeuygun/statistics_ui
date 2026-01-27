"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

type PongPayload = {
  recieved: { msg: string };
  at: number;
};

export default function RealtimePage() {
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null); //One reference ,one instance even if component is rendered.

  const [hello, setHello] = useState<string>("");
  const [status, setStatus] = useState<"connected" | "disconnected">(
    "disconnected",
  );
  const [lastPong, setLastPong] = useState<PongPayload | null>(null);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/testsocket`);

    socketRef.current = socket;

    //Listening events
    socket.on("connect", () => {
      setStatus("connected");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
      console.log(status);
    });

    // Client is listening that server will throw hello event on connection
    socket.on("server:hello", (data: { msg: string }) => {
      setHello(data.msg);
    });

    socket.on("server:pong", (data: PongPayload) => {
      setLastPong(data);
    });

    //Clean up effects while closing page.(like closing socket for pretend data leak)
    return () => {
      socket.disconnect();
      socketRef.current = null; //Close ref
    };
  }, []);

  const sendPing = () => {
    socketRef.current?.emit("client:ping", { msg: "ping from UI" });
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-2xl border p-5 shadow-sm">
        <h1 className="text-xl font-semibold">Realtime Test</h1>

        <div className="mt-3 text-sm">
          <div>
            <span className="font-medium">Status:</span> {status}
          </div>

          <div className="mt-1">
            <span className="font-medium">Hello:</span>{" "}
            {hello ? hello : "(didn't come yet)"}
          </div>
        </div>

        <button
          onClick={sendPing}
          className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-black transition-all duration-200 cursor-pointer active:scale-95"
          disabled={status !== "connected"}
        >
          Send ping
        </button>
        <button
          className="ml-4 mt-4 rounded-xl bg-gray-700 px-4 py-2 text-white hover:bg-black transition-all duration-200 cursor-pointer active:scale-95"
          onClick={() => router.back()}
        >
          Go back
        </button>

        <div className="mt-4">
          <div className="text-sm font-medium">Last pong:</div>
          <pre className="mt-2 overflow-auto rounded-xl bg-zinc-100 p-3 text-xs text-black">
            {lastPong ? JSON.stringify(lastPong, null, 2) : "None"}
          </pre>
        </div>
      </div>
    </div>
  );
}

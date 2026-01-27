"use client";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-6">
      <button
        className="
        flex items-center justify-center
        w-24 h-24
        rounded-full
        bg-red-600
        text-white
        shadow-xl
        hover:bg-red-500
        hover:scale-110
        active:scale-95
        transition-all
        duration-200
        cursor-pointer
      "
        onClick={() => router.push("/realtime")}
      >
        <Power size={36} />
      </button>

      <p className="text-gray-300 text-sm tracking-wide">
        Click to connect real-time API
      </p>
    </div>
  );
}

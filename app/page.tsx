"use client";
import { Power } from "lucide-react";

export default function Page() {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <button
        className="
      flex items-center justify-center
      w-24 h-24
      rounded-full
      bg-blue-600
      text-white
      shadow-xl
      hover:bg-blue-500
      hover:scale-110
      active:scale-95
      transition-all
      duration-200
      cursor-pointer
    "
      >
        <Power size={36} />
      </button>
    </div>
  );
}

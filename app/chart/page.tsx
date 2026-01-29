"use client";

import RateChartCard from "./components/distribution-chart-card";

export default function ChartPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
            Real-time • WebSocket stream
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Live Number Frequency Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
            This page visualizes a continuous stream of randomly generated
            numbers from <span className="font-medium text-zinc-100">1</span> to{" "}
            <span className="font-medium text-zinc-100">10</span>. Each incoming
            value updates the frequency distribution in real time, so you can
            see which numbers appear most often.
          </p>
        </header>

        <div className="flex-1">
          <div className="h-full">
            <RateChartCard />
          </div>
        </div>

        <footer className="mt-6 text-xs text-zinc-500">
          Tip: Use <span className="text-zinc-200">Start Data Flow</span> to
          begin streaming and watch the bars update instantly.
        </footer>
      </div>
    </main>
  );
}

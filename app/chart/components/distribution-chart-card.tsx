"use client";

import { SocketContext } from "@/app/contexts/Socket.Context";
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const NUMBER_RANGE = 10; // how many of {number,stats} pair that ui expects

type RateRow = {
  number: number;
  rate: number;
};

//

export default function RateChartCard() {
  const router = useRouter();

  const context = useContext(SocketContext);
  if (!context)
    throw new Error("SocketContext must be used inside SocketProvider");

  const { statsHistory } = context;
  const data: RateRow[] = useMemo(() => {
    if (statsHistory.length === 0) {
      return Array.from({ length: NUMBER_RANGE }, (_, i) => ({
        number: i + 1,
        rate: 0,
      }));
    }

    const total = statsHistory.length;

    return Array.from({ length: NUMBER_RANGE }, (_, i) => {
      const n = i + 1;

      const count = statsHistory.filter((v) => v === n).length;

      return {
        number: n,
        rate: (count / total) * 100,
      };
    });
  }, [statsHistory]);

  return (
    <section className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <button
        onClick={() => router.back()}
        className="mb-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10 active:scale-[0.98]"
      >
        <span className="text-base">←</span>
        Back
      </button>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-medium text-zinc-400">
            Live Distribution
          </div>
          <h2 className="mt-1 text-base font-semibold text-zinc-100">
            Number Rate (%)
          </h2>
          <p className="mt-1 text-sm text-zinc-300">
            Percentage share of each number in the total stream.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
          Mode: Percentage
        </div>
      </div>

      <div className="my-4 h-px w-full bg-white/10" />

      <div className="flex-1 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="h-90 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis
                dataKey="number"
                tick={{ fill: "rgba(244,244,245,0.8)" }}
              />

              <YAxis tick={{ fill: "rgba(244,244,245,0.8)" }} unit="%" />

              <Tooltip
                cursor={false}
                formatter={(value) => [`${value}%`, "Rate"]}
                contentStyle={{
                  background: "rgba(10,10,14,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "rgba(244,244,245,0.9)",
                }}
              />

              <Line
                type="monotone"
                dataKey="rate"
                stroke="rgba(99,102,241,0.9)"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "rgba(99,102,241,0.9)",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-xs text-zinc-400">
        Rates are calculated based on total received samples.
      </div>
    </section>
  );
}

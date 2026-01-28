"use client";

import { useStats } from "@/providers/SocketProvider";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type RateRow = {
  number: number; // 1..10
  rate: number; // percentage
};

// Temporary placeholder data

export default function RateChartCard() {
  const { statsValue } = useStats();

  const loading = statsValue === null;

  const data: RateRow[] | null = Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    rate: 0,
  }));

  return (
    <section className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
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
            <BarChart
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
                formatter={(value) => [`${value}%`, "Rate"]}
                contentStyle={{
                  background: "rgba(10,10,14,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "rgba(244,244,245,0.9)",
                }}
              />

              <Bar dataKey="rate" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-xs text-zinc-400">
        Rates are calculated based on total received samples.
      </div>
    </section>
  );
}

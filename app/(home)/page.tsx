"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "../components/Spinner";
import { useSocket } from "@/hooks/useSocket";

export default function HomePage() {
  const router = useRouter();

  const context = useSocket();

  const {
    connectionState,
    handleDataFlow,
    dataFlowState,
    lastUpdate,
    connectionErrorMessage,
    statsLoading,
  } = context;
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-48 -right-45 h-105 w-105 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-55 -left-55 h-130 w-130 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col px-6 py-14 md:py-20">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200">
          <span className="relative flex h-2 w-2">
            {connectionState !== "disconnected" && (
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-40 ${
                  connectionState === "connected"
                    ? "bg-emerald-400 animate-ping"
                    : "bg-yellow-400 animate-ping"
                }`}
              />
            )}

            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                connectionState === "connected"
                  ? "bg-emerald-400"
                  : connectionState === "connecting" ||
                      connectionState === "reconnecting"
                    ? "bg-yellow-400"
                    : "bg-red-500"
              }`}
            />
          </span>
          {connectionState === "connected" && "LIVE • WebSocket Streaming"}
          {connectionState === "connecting" && "CONNECTING • WebSocket"}
          {connectionState === "reconnecting" && "RECONNECTING • WebSocket"}
          {connectionState === "disconnected" && "OFFLINE • No Connection"}
        </div>

        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Statistics,
              <span className="text-white/90"> connects to live data.</span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-300 md:text-lg">
              This application receives metrics produced by your{" "}
              <span className="text-zinc-100">own API services</span> via{" "}
              <span className="text-zinc-100">WebSocket</span> and updates the{" "}
              <span className="text-zinc-100">line chart</span> in real time.
              Track trends without refreshing the page.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                aria-label={connectionState}
                onClick={() => router.push("/chart")}
                className="inline-flex items-center justify-center cursor-pointer rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Go to Live Chart
              </button>

              <button
                aria-label={connectionState}
                className="inline-flex items-center cursor-pointer justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
                onClick={handleDataFlow}
                data-testid="flow-toggle"
              >
                {`${dataFlowState === "started" ? "Stop" : "Start"} Data Flow`}
              </button>

              {connectionErrorMessage && (
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    {/* Sol ikon */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20">
                      <span className="text-red-400 text-lg">⚠️</span>
                    </div>

                    {/* Sağ içerik */}
                    <div className="flex-1">
                      {/* Başlık */}
                      <p className="text-sm font-semibold text-red-200">
                        Connection Error
                      </p>

                      <p className="mt-1 text-sm text-zinc-200/80">
                        {connectionErrorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 text-xs text-zinc-400">
              Latency-aware • Stream-first • Dashboard-ready
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-100">
                Live Feed Overview
              </div>
              <div className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-zinc-300">
                {`ws:// ${connectionState}`}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-zinc-400">Current Rate</div>
                <div
                  className="mt-1 text-2xl font-semibold"
                  data-testid="current-rate"
                >
                  {dataFlowState === "started" ? (
                    lastUpdate === null || lastUpdate === 0 || statsLoading ? (
                      <Spinner />
                    ) : (
                      `~${Math.floor(1000 / lastUpdate)}`
                    )
                  ) : (
                    "Click Start Data Flow to see"
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-zinc-400">Last Update</div>
                <div className="mt-1 text-sm font-medium text-zinc-200">
                  {dataFlowState === "started" ? (
                    lastUpdate === null || lastUpdate === 0 || statsLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        {lastUpdate}{" "}
                        <span className="text-zinc-400">milliseconds</span>
                      </>
                    )
                  ) : (
                    'Click "Start Data Flow" to see'
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-zinc-400">Next Step</div>
                <div className="mt-1 text-sm text-zinc-200">
                  Open the chart page to start plotting live data.
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs font-medium text-zinc-300">
                How it works
              </div>
              <ol className="mt-3 space-y-2 text-sm text-zinc-300">
                <li className="flex gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-xs text-zinc-100">
                    1
                  </span>
                  Service produces metrics (interval / event-driven).
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-xs text-zinc-100">
                    2
                  </span>
                  Gateway (WebSocket) publishes to clients.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-xs text-zinc-100">
                    3
                  </span>
                  UI listens via socket.on(...) and updates the chart.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          <FeatureCard
            title="Real-time Updates"
            desc="Push-based updates with WebSocket. No page refresh needed."
          />
          <FeatureCard
            title="Trend-focused Visualization"
            desc="Catch trends, spikes, and patterns using line charts."
          />
          <FeatureCard
            title="Service-aligned Architecture"
            desc="Data is produced in the backend; UI only subscribes and renders."
          />
        </section>

        <footer className="mt-14 border-t border-white/10 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Statistics • Built for streaming metrics.
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
      <div className="text-sm font-semibold text-zinc-100">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{desc}</p>
    </div>
  );
}

export function Spinner() {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="
          w-5 h-5
          rounded-full
          border
          border-white/10
          border-t-indigo-400/80
          animate-spin
        "
        role="status"
        aria-label="loading"
      />
      <span className="text-xs text-zinc-400">Loading...</span>
    </span>
  );
}

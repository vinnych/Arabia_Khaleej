import { parseDate } from "@/lib/utils";

/**
 * Renders a tear-off calendar badge:
 *   ┌──────┐
 *   │ MAR  │  ← Qatar maroon header
 *   │  21  │  ← day
 *   │ 2026 │  ← year
 *   └──────┘
 *
 * Falls back to a plain text display if the date can't be parsed.
 */
export default function CalendarDate({
  dateStr,
  className = "",
}: {
  dateStr: string | undefined | null;
  className?: string;
}) {
  const parsed = parseDate(dateStr);

  if (!parsed) {
    return (
      <span className={`text-[11px] text-gray-400 dark:text-slate-500 tabular-nums ${className}`}>
        {dateStr ?? ""}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex flex-col items-center rounded-lg overflow-hidden shrink-0 select-none ${className}`}
      style={{ width: 38, border: "1px solid rgba(139,26,60,0.18)" }}
      aria-label={parsed.display}
    >
      {/* Month header */}
      <span
        className="w-full text-center text-[9px] font-bold tracking-wider py-0.5 leading-tight"
        style={{ background: "#8B1A3C", color: "#F8ECD2" }}
      >
        {parsed.mon}
      </span>
      {/* Day */}
      <span
        className="text-base font-bold leading-tight py-0.5 text-on-surface"
      >
        {parsed.day}
      </span>
      {/* Year */}
      <span
        className="text-[8px] text-gray-400 dark:text-slate-500 pb-0.5 leading-tight tabular-nums"
      >
        {parsed.year}
      </span>
    </span>
  );
}

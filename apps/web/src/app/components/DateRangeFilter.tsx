"use client";

import { useRef } from "react";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export default function DateRangeFilter({
  from,
  to,
  onChange,
}: DateRangeFilterProps) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2 flex-wrap select-none cursor-default">
      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          ref={fromRef}
          type="date"
          value={from}
          onChange={(e) => onChange(e.target.value, to)}
          style={{
            border: "1px solid #2A2F3A",
            borderRadius: 4,
            padding: "4px 28px 4px 8px",
          }}
        />
        <button
          type="button"
          onClick={() => fromRef.current?.showPicker?.()}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Open calendar"
        >
          📅
        </button>
      </div>

      <span className="text-xs text-textMuted">to</span>

      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          ref={toRef}
          type="date"
          value={to}
          onChange={(e) => onChange(from, e.target.value)}
          style={{
            border: "1px solid #2A2F3A",
            borderRadius: 4,
            padding: "4px 28px 4px 8px",
          }}
        />
        <button
          type="button"
          onClick={() => toRef.current?.showPicker?.()}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label="Open calendar"
        >
          📅
        </button>
      </div>

      {(from || to) && (
        <button
          onClick={() => onChange("", "")}
          className="text-xs text-textMuted underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

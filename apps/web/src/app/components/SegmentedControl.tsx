type ChartType = "bar" | "line" | "pie";

interface SegmentedControlProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
}

export default function SegmentedControl({
  value,
  onChange,
}: SegmentedControlProps) {
  const options: ChartType[] = ["bar", "line", "pie"];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            fontWeight: value === opt ? "bold" : "normal",
            border: "1px solid #2A2F3A",
            borderRadius: 4,
            padding: "4px 8px",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

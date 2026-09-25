import { CalendarDays } from "lucide-react";

const ranges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
];

function DateRangeSelector({ value = "7d", onChange }) {
  return (
    <div className="dm-date-range-selector">
      <div className="dm-date-range-label">
        <CalendarDays size={17} />
        <span>Date range</span>
      </div>

      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-label="Select date range"
      >
        {ranges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DateRangeSelector;

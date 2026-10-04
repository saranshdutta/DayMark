import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const pct = payload[0]?.value;
    return (
      <div style={{
        background: "var(--dm-surface)",
        border: "1px solid var(--dm-border)",
        borderRadius: "8px",
        padding: "8px 14px",
        boxShadow: "var(--dm-shadow-md)",
      }}>
        <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-bold)", color: pct >= 100 ? "var(--dm-success)" : "var(--dm-primary)" }}>
          {pct}% complete
        </p>
      </div>
    );
  }
  return null;
};

function GoalAnalytics({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dm-text-muted)", fontSize: "var(--dm-text-sm)" }}>
        No goal data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: -20, bottom: 4 }}
        barSize={24}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="var(--dm-border)"
          strokeOpacity={0.7}
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--dm-text-muted)", fontSize: 11 }}
          tickMargin={8}
        />

        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          width={34}
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: "var(--dm-text-muted)", fontSize: 11 }}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--dm-surface-hover)", borderRadius: "4px" }} />

        <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.completed >= 100 ? "var(--dm-success)" : "var(--dm-primary)"}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GoalAnalytics;

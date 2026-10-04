import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// Theme-aligned colors for chart segments
const COLORS = [
  "#193b2d", // deep forest (primary)
  "#477c64", // mid green (dark primary)
  "#6e9480", // sage
  "#2d5b88", // info blue
  "#94681f", // warm amber
  "#2b704c", // success green
  "#a43a3a", // coral red
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--dm-surface)",
        border: "1px solid var(--dm-border)",
        borderRadius: "8px",
        padding: "8px 14px",
        boxShadow: "var(--dm-shadow-md)",
      }}>
        <p style={{ fontSize: "var(--dm-text-xs)", fontWeight: "var(--dm-weight-semibold)", color: "var(--dm-text-primary)" }}>
          {payload[0].name}
        </p>
        <p style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-bold)", color: payload[0].payload.fill }}>
          {payload[0].value} logged
        </p>
      </div>
    );
  }
  return null;
};

function CategoryChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dm-text-muted)", fontSize: "var(--dm-text-sm)" }}>
        No category data yet
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {data.slice(0, 5).map((item, index) => {
          const total = data.reduce((s, d) => s + d.value, 0);
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "2px", backgroundColor: COLORS[index % COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)" }}>{item.name}</span>
              </div>
              <span style={{ fontSize: "var(--dm-text-xs)", fontWeight: "var(--dm-weight-semibold)", color: "var(--dm-text-primary)" }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryChart;

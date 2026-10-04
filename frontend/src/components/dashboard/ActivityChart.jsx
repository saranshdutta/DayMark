import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--dm-surface)",
        border: "1px solid var(--dm-border)",
        borderRadius: "8px",
        padding: "8px 14px",
        boxShadow: "var(--dm-shadow-md)",
      }}>
        <p style={{ fontSize: "11px", color: "var(--dm-text-muted)", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-primary)" }}>
          {payload[0].value} {payload[0].value === 1 ? "activity" : "activities"}
        </p>
      </div>
    );
  }
  return null;
};

function ActivityChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={{
        height: "220px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--dm-text-muted)",
        fontSize: "var(--dm-text-sm)",
      }}>
        Log activities to see your weekly trend
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--dm-primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--dm-primary)" stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="var(--dm-border)"
          strokeOpacity={0.7}
        />

        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--dm-text-muted)", fontSize: 11 }}
          tickMargin={6}
        />

        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          width={30}
          tick={{ fill: "var(--dm-text-muted)", fontSize: 11 }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="activities"
          stroke="var(--dm-primary)"
          strokeWidth={2.5}
          fill="url(#dashboardAreaGrad)"
          dot={{ r: 3.5, fill: "var(--dm-surface)", stroke: "var(--dm-primary)", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: "var(--dm-primary)", stroke: "var(--dm-surface)", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default ActivityChart;

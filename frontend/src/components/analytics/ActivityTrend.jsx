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
          {payload[0].value} activities
        </p>
      </div>
    );
  }
  return null;
};

function ActivityTrend({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dm-text-muted)", fontSize: "var(--dm-text-sm)" }}>
        No activity data for this range
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--dm-primary)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--dm-primary)" stopOpacity={0}   />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="var(--dm-border)"
          strokeOpacity={0.6}
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--dm-text-muted)", fontSize: 11 }}
          tickMargin={8}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          width={36}
          tick={{ fill: "var(--dm-text-muted)", fontSize: 11 }}
          allowDecimals={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--dm-primary)"
          strokeWidth={2.5}
          fill="url(#activityGradient)"
          dot={{ r: 3.5, fill: "var(--dm-surface)", stroke: "var(--dm-primary)", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: "var(--dm-primary)", stroke: "var(--dm-surface)", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default ActivityTrend;

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function ActivityTrend({ data = [] }) {
  return (
    <div className="dm-panel">
      <div className="dm-panel-header">
        <div>
          <h3>Activity trend</h3>
          <p>Track your activity over time</p>
        </div>
      </div>

      <div className="dm-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--dm-border)" />

            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--dm-text-muted)', fontSize: 12}} />

            <YAxis axisLine={false} tickLine={false} width={40} tick={{fill: 'var(--dm-text-muted)', fontSize: 12}} />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--dm-border)",
                boxShadow: "var(--dm-shadow-md)",
                backgroundColor: "var(--dm-surface)",
                color: "var(--dm-text)",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--dm-primary)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--dm-surface)", stroke: "var(--dm-primary)", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "var(--dm-primary)", stroke: "var(--dm-surface)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityTrend;

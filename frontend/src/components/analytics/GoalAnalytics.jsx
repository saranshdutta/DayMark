import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function GoalAnalytics({ data = [] }) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="dm-panel">
      <div className="dm-panel-header">
        <div>
          <h3>Goal performance</h3>
          <p>Compare your progress against your targets</p>
        </div>
      </div>

      <div className="dm-chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--dm-border)" />

            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dm-text-muted)', fontSize: 12}} />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(value) => `${value}%`}
              tick={{fill: 'var(--dm-text-muted)', fontSize: 12}}
            />

            <Tooltip
              formatter={(value, name) => [
                `${value}%`,
                name === "completed" ? "Completed" : "Target",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--dm-border)",
                boxShadow: "var(--dm-shadow-md)",
                backgroundColor: "var(--dm-surface)",
                color: "var(--dm-text)",
              }}
            />

            <Bar
              dataKey="completed"
              name="Completed"
              fill="#2c4d3b"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />

            <Bar
              dataKey="target"
              name="Target"
              fill="#e6e4df"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GoalAnalytics;

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function ActivityChart({ data = [] }) {
  return (
    <div className="dm-panel dm-activity-chart">
      <div className="dm-panel-header">
        <div>
          <h3>Activity overview</h3>
          <p>Your activity count over the last 7 days</p>
        </div>
      </div>

      <div className="dm-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="activityChartGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopOpacity={0.25} />
                <stop offset="100%" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis dataKey="day" axisLine={false} tickLine={false} />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={35}
            />

            <Tooltip
              formatter={(value) => [`${value} activities`, "Activities"]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />

            <Area
              type="monotone"
              dataKey="activities"
              strokeWidth={2}
              fill="url(#activityChartGradient)"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityChart;

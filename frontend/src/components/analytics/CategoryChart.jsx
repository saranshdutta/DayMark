import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// Fallback colors for the pie chart using standard CSS variables equivalent
const COLORS = ["#2c4d3b", "#5c6860", "#8b998f", "#e6e4df"];

function CategoryChart({ data = [] }) {
  return (
    <div className="dm-panel">
      <div className="dm-panel-header">
        <div>
          <h3>Activity categories</h3>
          <p>How your activities are distributed</p>
        </div>
      </div>

      <div className="dm-chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              labelLine={false}
              stroke="var(--dm-surface)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip 
              formatter={(value, name) => [`${value}%`, name]} 
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--dm-border)",
                boxShadow: "var(--dm-shadow-md)",
                backgroundColor: "var(--dm-surface)",
                color: "var(--dm-text)",
              }}
            />

            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "13px", color: "var(--dm-text-secondary)" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CategoryChart;

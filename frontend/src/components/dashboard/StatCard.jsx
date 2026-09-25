import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = "vs last week",
  trendType = "up",
  className = "",
}) {
  const hasTrend = trend !== undefined && trend !== null && trend !== "";

  return (
    <div className={["dm-stat-card", className].filter(Boolean).join(" ")}>
      <div className="dm-stat-card-top">
        <div className="dm-stat-card-icon">{Icon && <Icon size={21} />}</div>

        {hasTrend && (
          <div
            className={[
              "dm-stat-card-trend",
              trendType === "down" ? "is-down" : "is-up",
            ].join(" ")}
          >
            {trendType === "down" ? (
              <ArrowDownRight size={15} />
            ) : (
              <ArrowUpRight size={15} />
            )}

            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="dm-stat-card-content">
        <p className="dm-stat-card-title">{title}</p>

        <h3 className="dm-stat-card-value">{value}</h3>

        {(subtitle || hasTrend) && (
          <div className="dm-stat-card-footer">
            {subtitle && <span>{subtitle}</span>}

            {hasTrend && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;

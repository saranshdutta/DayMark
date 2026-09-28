import { useState, useEffect } from "react";
import { BarChart3, Activity, Target, Clock3, Flame } from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import ActivityTrend from "../components/analytics/ActivityTrend";
import CategoryChart from "../components/analytics/CategoryChart";
import GoalAnalytics from "../components/analytics/GoalAnalytics";
import DateRangeSelector from "../components/analytics/DateRangeSelector";
import EmptyState from "../components/common/EmptyState";
import { useApp } from "../context/AppContext";
import analyticsService from "../services/analyticsService";

function Analytics() {
  const { goals } = useApp();

  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  // Summary stats scoped to the selected date range (from backend)
  const [rangedStats, setRangedStats] = useState({
    totalActivities: 0,
    totalDuration: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const [trendRes, categoryRes, streakRes, overviewRes] = await Promise.all([
          analyticsService.getActivityTrend({ range: dateRange }),
          analyticsService.getCategoryBreakdown({ range: dateRange }),
          analyticsService.getStreak(),
          analyticsService.getOverview({ range: dateRange }),
        ]);

        if (isMounted) {
          // trendRes: array of { date, count }
          const formattedTrend = (trendRes || []).map((t) => ({
            date: new Date(t.date).toLocaleDateString(undefined, { weekday: "short" }),
            value: t.count,
          }));
          setTrendData(formattedTrend);

          // categoryRes: array of { category, count, totalDuration }
          const formattedCategories = (categoryRes || []).map((c) => ({
            name: c.category.charAt(0) + c.category.slice(1).toLowerCase(),
            value: c.count,
          }));
          setCategoryData(formattedCategories);

          setStreak(streakRes || { current: 0, longest: 0 });

          // overviewRes: { totalLogs, totalGoals, activeGoals, range }
          // Derive totalDuration from the category breakdown (same date window)
          const totalDuration = (categoryRes || []).reduce(
            (sum, c) => sum + (c.totalDuration || 0),
            0,
          );
          setRangedStats({
            totalActivities: overviewRes?.totalLogs ?? 0,
            totalDuration,
          });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [dateRange]);

  const displayGoals = goals;

  const goalProgress =
    displayGoals.length > 0
      ? Math.round(
          displayGoals.reduce((total, goal) => {
            if (!goal.target && !goal.targetValue) return total;
            const target = Number(goal.targetValue || goal.target);
            const progress = Math.min(
              100,
              (Number(goal.currentProgress || goal.current || 0) / target) * 100,
            );
            return total + progress;
          }, 0) / displayGoals.length,
        )
      : 0;

  const formattedActiveTime =
    rangedStats.totalDuration >= 60
      ? `${Math.floor(rangedStats.totalDuration / 60)}h ${rangedStats.totalDuration % 60}m`
      : `${rangedStats.totalDuration}m`;

  const hasRangedData = rangedStats.totalActivities > 0;
  const hasGoals = displayGoals.length > 0;

  return (
    <div className="dm-page">
      <div className="dm-page-header">
        <div className="dm-page-title-row">
          <div className="dm-page-title-icon">
            <BarChart3 size={21} />
          </div>

          <div>
            <h1>Analytics</h1>
            <p>Understand your habits and track your progress over time.</p>
          </div>
        </div>

        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      <div className="dm-stats-grid">
        <StatCard
          title="Total activities"
          value={rangedStats.totalActivities}
          subtitle="Selected period"
          icon={Activity}
        />

        <StatCard
          title="Active time"
          value={formattedActiveTime}
          subtitle="Time logged"
          icon={Clock3}
        />

        <StatCard
          title="Goal completion"
          value={`${goalProgress}%`}
          subtitle="Average progress"
          icon={Target}
        />

        <StatCard
          title="Current streak"
          value={`${streak.current} ${streak.current === 1 ? "day" : "days"}`}
          subtitle="Consistency"
          icon={Flame}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--dm-text-muted)" }}>
          Loading analytics...
        </div>
      ) : !hasRangedData && !hasGoals ? (
        <EmptyState
          icon={BarChart3}
          title="No data to analyze"
          message="Log some activities or create goals to see your analytics."
        />
      ) : (
        <>
          <div className="dm-analytics-grid">
            <ActivityTrend data={trendData} />
            <CategoryChart data={categoryData} />
          </div>

          <div className="dm-analytics-full">
            {hasGoals ? (
              <GoalAnalytics
                data={displayGoals.map((goal) => {
                  const target = Number(goal.targetValue || goal.target);
                  const current = Number(goal.currentProgress || goal.current || 0);
                  return {
                    name: goal.title,
                    completed:
                      target > 0
                        ? Math.min(100, Math.round((current / target) * 100))
                        : 0,
                    target: 100,
                  };
                })}
              />
            ) : (
              <EmptyState
                icon={Target}
                title="No active goals"
                message="Create goals to track their progress here."
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;

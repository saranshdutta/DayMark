import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Activity,
  Target,
  Clock3,
  Flame,
  PieChart as PieIcon,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import StatCard from "../components/dashboard/StatCard";
import ActivityTrend from "../components/analytics/ActivityTrend";
import CategoryChart from "../components/analytics/CategoryChart";
import GoalAnalytics from "../components/analytics/GoalAnalytics";
import { Tabs } from "../components/common/Tabs";
import EmptyState from "../components/common/EmptyState";

import { useApp } from "../context/AppContext";
import analyticsService from "../services/analyticsService";

function Analytics() {
  const { activities, goals } = useApp();

  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const [trendRes, categoryRes, streakRes] = await Promise.all([
          analyticsService.getActivityTrend({ range: dateRange }),
          analyticsService.getCategoryBreakdown({ range: dateRange }),
          analyticsService.getStreak(),
        ]);

        if (isMounted) {
          const formattedTrend = (trendRes || []).map((t) => ({
            date: new Date(t.date).toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" }),
            value: t.count,
          }));
          setTrendData(formattedTrend);

          const formattedCategories = (categoryRes || []).map((c) => ({
            name: c.category.charAt(0) + c.category.slice(1).toLowerCase(),
            value: c.count,
          }));
          setCategoryData(formattedCategories);

          setStreak(streakRes || { current: 0, longest: 0 });
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

  const stats = useMemo(() => {
    const totalActivities = activities.length;
    const activeTime = activities.reduce(
      (total, a) => total + (Number(a.duration) || 0),
      0
    );

    const goalProgress =
      goals.length > 0
        ? Math.round(
            goals.reduce((total, goal) => {
              const target = Number(goal.targetValue || goal.target || 1);
              const current = Number(goal.currentProgress || goal.current || 0);
              return total + Math.min(100, (current / target) * 100);
            }, 0) / goals.length
          )
        : 0;

    return { totalActivities, activeTime, goalProgress };
  }, [activities, goals]);

  const formattedActiveTime =
    stats.activeTime >= 60
      ? `${Math.floor(stats.activeTime / 60)}h ${stats.activeTime % 60}m`
      : `${stats.activeTime}m`;

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      {/* Page Header & Range Switcher */}
      <PageHeader
        title="Analytics"
        subtitle="Understand your habits and track long-term academic & wellness consistency."
        actions={
          <Tabs
            tabs={[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
            ]}
            activeTab={dateRange}
            onChange={setDateRange}
          />
        }
      />

      {/* Top Metric Cards */}
      <div className="dm-grid-4">
        <StatCard
          title="Total Activities"
          value={stats.totalActivities}
          subtitle={`Last ${dateRange}`}
          icon={Activity}
          variant="primary"
        />
        <StatCard
          title="Logged Time"
          value={formattedActiveTime}
          subtitle="Active effort tracked"
          icon={Clock3}
          variant="info"
        />
        <StatCard
          title="Goal Completion"
          value={`${stats.goalProgress}%`}
          subtitle="Average across goals"
          icon={Target}
          variant="success"
          progress={stats.goalProgress}
        />
        <StatCard
          title="Streak Record"
          value={`${streak.current}d`}
          subtitle={`Longest: ${streak.longest}d`}
          icon={Flame}
          variant="warning"
        />
      </div>

      {/* Visual Chart Hierarchy */}
      {loading ? (
        <div className="dm-card" style={{ padding: "var(--dm-space-10)", textAlign: "center", color: "var(--dm-text-muted)" }}>
          Loading analytical charts...
        </div>
      ) : activities.length === 0 && goals.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics data available"
          message="Log daily activities or create goals to view analytical trends over time."
        />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--dm-space-5)" }}>
            <div style={{ gridColumn: "span 8" }} className="dm-card">
              <div className="dm-section-header">
                <h2 className="dm-section-title">
                  <TrendingUp size={18} style={{ color: "var(--dm-primary)" }} /> Activity Trend Line
                </h2>
              </div>
              <ActivityTrend data={trendData} />
            </div>

            <div style={{ gridColumn: "span 4" }} className="dm-card">
              <div className="dm-section-header">
                <h2 className="dm-section-title">
                  <PieIcon size={18} style={{ color: "var(--dm-primary)" }} /> Category Breakdown
                </h2>
              </div>
              <CategoryChart data={categoryData} />
            </div>
          </div>

          <div className="dm-card">
            <div className="dm-section-header">
              <h2 className="dm-section-title">Goal Analytics</h2>
            </div>
            {goals.length > 0 ? (
              <GoalAnalytics
                data={goals.map((g) => {
                  const target = Number(g.targetValue || g.target || 1);
                  const current = Number(g.currentProgress || g.current || 0);
                  return {
                    name: g.title,
                    completed: Math.min(100, Math.round((current / target) * 100)),
                    target: 100,
                  };
                })}
              />
            ) : (
              <EmptyState
                icon={Target}
                title="No active goals"
                message="Create goals to analyze target attainment."
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;

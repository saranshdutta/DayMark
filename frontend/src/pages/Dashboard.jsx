import { useEffect, useMemo, useState } from "react";
import { Activity, Target, Clock3, Flame, Plus } from "lucide-react";

import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

import StatCard from "../components/dashboard/StatCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import GoalProgress from "../components/dashboard/GoalProgress";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivities from "../components/dashboard/RecentActivities";
import StreakCard from "../components/dashboard/StreakCard";
import WeeklyProgress from "../components/dashboard/WeeklyProgress";

import ActivityForm from "../components/activities/ActivityForm";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import dashboardService from "../services/dashboardService";

function Dashboard() {
  const { user } = useAuth();
  const { activities, goals, addActivity } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [chartData, setChartData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchDashboardExtras = async () => {
      try {
        const [streakData, chart, weekly] = await Promise.all([
          dashboardService.getStreak(),
          dashboardService.getActivityChart("7d"),
          dashboardService.getWeeklyProgress(),
        ]);
        setStreak(streakData || { current: 0, longest: 0 });
        setChartData(Array.isArray(chart) ? chart : []);
        setWeeklyData(Array.isArray(weekly) ? weekly : []);
      } catch {
        // Silently fail — data may just be empty for new users
      }
    };
    fetchDashboardExtras();
  }, []);

  const dashboardStats = useMemo(() => {
    const totalActivities = activities.length;
    const activeTime = activities.reduce(
      (total, a) => total + (Number(a.duration) || 0),
      0
    );
    const goalCompletion =
      goals.length > 0
        ? Math.round(
            goals.reduce((total, goal) => {
              const target = goal.targetValue || goal.target;
              const current = goal.currentProgress || goal.current || 0;
              if (!target) return total;
              return total + Math.min(100, (Number(current) / Number(target)) * 100);
            }, 0) / goals.length
          )
        : 0;

    return { totalActivities, activeTime, goalCompletion };
  }, [activities, goals]);

  const formattedActiveTime =
    dashboardStats.activeTime >= 60
      ? `${Math.floor(dashboardStats.activeTime / 60)}h ${dashboardStats.activeTime % 60}m`
      : `${dashboardStats.activeTime}m`;

  const firstName = user?.name?.split(" ")[0] || "Student";

  const handleAddActivity = async (activityData) => {
    await addActivity(activityData);
    setIsModalOpen(false);
  };

  // Normalize goals for GoalProgress component
  const normalizedGoals = goals.slice(0, 5).map((g) => ({
    id: g.id,
    title: g.title,
    current: g.currentProgress ?? g.current ?? 0,
    target: g.targetValue ?? g.target ?? 1,
    unit: g.unit,
  }));

  return (
    <div className="dm-page dm-dashboard">
      {/* Page heading */}
      <div className="dm-dashboard-welcome">
        <div>
          <span className="dm-dashboard-eyebrow">Your day at a glance</span>
          <h1>Good to see you, {firstName}.</h1>
          <p>Here&apos;s how your activities and goals are looking today.</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Log activity
        </Button>
      </div>

      {/* Statistics */}
      <div className="dm-stats-grid">
        <StatCard
          title="Activities"
          value={dashboardStats.totalActivities}
          subtitle="Logged activities"
          icon={Activity}
        />
        <StatCard
          title="Active time"
          value={formattedActiveTime}
          subtitle="Total minutes logged"
          icon={Clock3}
        />
        <StatCard
          title="Goal progress"
          value={`${dashboardStats.goalCompletion}%`}
          subtitle="Average completion"
          icon={Target}
        />
        <StatCard
          title="Current streak"
          value={`${streak.current} day${streak.current !== 1 ? "s" : ""}`}
          subtitle={`Best: ${streak.longest} days`}
          icon={Flame}
        />
      </div>

      {/* Main dashboard grid */}
      <div className="dm-dashboard-main-grid">
        <ActivityChart data={chartData} />
        <GoalProgress goals={normalizedGoals} />
      </div>

      {/* Weekly + streak */}
      <div className="dm-dashboard-secondary-grid">
        <WeeklyProgress data={weeklyData} />
        <StreakCard currentStreak={streak.current} longestStreak={streak.longest} />
      </div>

      {/* Recent activities + quick actions */}
      <div className="dm-dashboard-bottom-grid">
        <RecentActivities activities={activities.slice(0, 5)} />
        <QuickActions />
      </div>

      {/* Add activity modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log activity"
        description="Record something you did today."
      >
        <ActivityForm
          onSubmit={handleAddActivity}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;

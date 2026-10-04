import React, { useState, useMemo } from "react";
import {
  Target,
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  Trophy,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { Button, IconButton } from "../components/common/Button";
import { Badge, ProgressBar } from "../components/common/Badge";
import { Tabs } from "../components/common/Tabs";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Modal from "../components/common/Modal";
import { Input, Select } from "../components/common/Input";

import { useApp } from "../context/AppContext";

const frequencyColors = {
  DAILY:   { text: "var(--dm-primary)", bg: "var(--dm-primary-soft)"  },
  WEEKLY:  { text: "var(--dm-info)",    bg: "var(--dm-info-soft)"     },
  MONTHLY: { text: "var(--dm-warning)", bg: "var(--dm-warning-soft)"  },
};

function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();

  const [activeTab, setActiveTab]     = useState("active");
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingId, setDeletingId]   = useState(null);

  const [formData, setFormData] = useState({
    title:       "",
    targetValue: 10,
    unit:        "hours",
    frequency:   "WEEKLY",
  });
  const [loading, setLoading] = useState(false);

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      const current = Number(g.currentProgress ?? g.current ?? 0);
      const target  = Number(g.targetValue ?? g.target ?? 1);
      const isCompleted = current >= target;

      if (activeTab === "active")    return !isCompleted;
      if (activeTab === "completed") return isCompleted;
      return true;
    });
  }, [goals, activeTab]);

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title:       goal.title || "",
        targetValue: goal.targetValue || goal.target || 10,
        unit:        goal.unit || "hours",
        frequency:   goal.frequency || "WEEKLY",
      });
    } else {
      setEditingGoal(null);
      setFormData({ title: "", targetValue: 10, unit: "hours", frequency: "WEEKLY" });
    }
    setModalOpen(true);
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, formData);
      } else {
        await addGoal(formData);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await deleteGoal(deletingId);
      setDeletingId(null);
    }
  };

  // Summary counts
  const totalGoals     = goals.length;
  const completedCount = goals.filter((g) => (g.currentProgress ?? 0) >= (g.targetValue ?? 1)).length;
  const activeCount    = totalGoals - completedCount;

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      {/* Page Header */}
      <PageHeader
        title="Goals"
        subtitle="Turn small routines into consistent long-term progress."
        actions={
          <Button variant="primary" size="md" icon={Plus} onClick={() => handleOpenModal()}>
            New Goal
          </Button>
        }
      />

      {/* Summary Row */}
      {totalGoals > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--dm-space-4)" }}>
          {[
            { label: "Total Goals",     value: totalGoals,     icon: Target,       color: "var(--dm-primary)",  bg: "var(--dm-primary-soft)"  },
            { label: "Active",          value: activeCount,    icon: TrendingUp,   color: "var(--dm-info)",     bg: "var(--dm-info-soft)"     },
            { label: "Completed",       value: completedCount, icon: Trophy,       color: "var(--dm-success)",  bg: "var(--dm-success-soft)"  },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="dm-stat-card">
              <div className="dm-stat-header">
                <span className="dm-stat-title">{label}</span>
                <div className="dm-stat-icon-wrapper" style={{ backgroundColor: bg, color, border: `1px solid ${color}22` }}>
                  <Icon size={15} />
                </div>
              </div>
              <div className="dm-stat-value" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Tabs
          tabs={[
            { id: "active",    label: "Active",    badge: activeCount    },
            { id: "completed", label: "Completed", badge: completedCount },
            { id: "all",       label: "All",       badge: totalGoals     },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Goal Cards Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title={activeTab === "completed" ? "No completed goals yet" : "No active goals set"}
          message="Set daily or weekly goals for study, health, or focus to track consistency."
          actionLabel="Create your first goal"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="dm-grid-2">
          {filteredGoals.map((goal) => {
            const current    = Number(goal.currentProgress ?? goal.current ?? 0);
            const target     = Number(goal.targetValue ?? goal.target ?? 1);
            const percentage = Math.min(100, Math.round((current / target) * 100));
            const isCompleted = current >= target;
            const freqColors  = frequencyColors[goal.frequency] || frequencyColors.WEEKLY;

            return (
              <div
                key={goal.id}
                className="dm-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "var(--dm-space-4)",
                  borderLeft: isCompleted ? "3px solid var(--dm-success)" : "3px solid transparent",
                }}
              >
                <div>
                  {/* Goal Title Row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--dm-space-2)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)", flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-semibold)" }}>
                          {goal.title}
                        </h3>
                        {isCompleted && (
                          <Badge variant="success" icon={CheckCircle2}>Done</Badge>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)", marginTop: "4px" }}>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "var(--dm-weight-semibold)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: freqColors.text,
                          backgroundColor: freqColors.bg,
                          padding: "2px 7px",
                          borderRadius: "var(--dm-radius-full)",
                        }}>
                          {goal.frequency || "WEEKLY"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                      <IconButton icon={Edit2}  size="sm" title="Edit goal"   onClick={() => handleOpenModal(goal)} />
                      <IconButton icon={Trash2} size="sm" title="Delete goal" onClick={() => setDeletingId(goal.id)} />
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginTop: "var(--dm-space-4)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--dm-space-2)" }}>
                      <span style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-bold)", color: "var(--dm-text-primary)" }}>
                        {current} <span style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", fontWeight: "normal" }}>/ {target} {goal.unit || "units"}</span>
                      </span>
                      <span style={{
                        fontSize: "var(--dm-text-sm)",
                        fontWeight: "var(--dm-weight-bold)",
                        color: isCompleted ? "var(--dm-success)" : "var(--dm-primary)",
                      }}>
                        {percentage}%
                      </span>
                    </div>

                    <ProgressBar
                      value={current}
                      max={target}
                      variant={isCompleted ? "success" : "primary"}
                      height={6}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "var(--dm-space-3)",
                  borderTop: "1px solid var(--dm-border)",
                  fontSize: "var(--dm-text-xs)",
                  color: "var(--dm-text-muted)",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Flame size={13} style={{ color: "var(--dm-warning)" }} />
                    <strong style={{ color: "var(--dm-text-primary)" }}>{goal.streak || 0}</strong>&nbsp;day streak
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={11} /> Resets Sunday
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Creator Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGoal ? "Edit Goal" : "Create New Goal"}
        subtitle="Define a measurable daily or weekly milestone."
      >
        <form onSubmit={handleSubmitGoal} style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
          <Input
            label="Goal Title"
            placeholder="e.g. Study 20 hours this week, Drink 2L water daily"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--dm-space-3)" }}>
            <Input
              label="Target Value"
              type="number"
              min="1"
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              required
            />

            <Input
              label="Unit"
              placeholder="hours, sessions, liters"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <Select
            label="Frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </Select>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--dm-space-2)", marginTop: "var(--dm-space-2)" }}>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={loading}>
              {editingGoal ? "Update Goal" : "Create Goal"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? History will be archived."
      />
    </div>
  );
}

export default Goals;

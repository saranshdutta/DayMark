import { useMemo, useState } from "react";
import { Target, Plus, CheckCircle2, CirclePause } from "lucide-react";

import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import GoalList from "../components/goals/GoalList";
import GoalForm from "../components/goals/GoalForm";
import { useApp } from "../context/AppContext";

function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const filteredGoals = useMemo(() => {
    if (filter === "ALL") return goals;
    return goals.filter((goal) => goal.status === filter);
  }, [goals, filter]);

  const goalStats = useMemo(() => {
    return {
      total: goals.length,
      active: goals.filter((g) => g.status === "ACTIVE").length,
      completed: goals.filter((g) => g.status === "COMPLETED").length,
      paused: goals.filter((g) => g.status === "PAUSED").length,
    };
  }, [goals]);

  const openCreateModal = () => { setEditingGoal(null); setIsModalOpen(true); };
  const openEditModal = (goal) => { setEditingGoal(goal); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingGoal(null); };

  const handleSubmit = async (goalData) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
    } else {
      await addGoal(goalData);
    }
    closeModal();
  };

  const handlePause = async (goal) => {
    await updateGoal(goal.id, {
      status: goal.status === "PAUSED" ? "ACTIVE" : "PAUSED",
    });
  };

  const handleComplete = async (goal) => {
    await updateGoal(goal.id, { status: "COMPLETED" });
  };

  const handleArchive = async (goal) => {
    await updateGoal(goal.id, { status: "ARCHIVED" });
  };

  const handleDelete = async (goal) => {
    const confirmed = window.confirm(`Delete "${goal.title}"?`);
    if (confirmed) {
      await deleteGoal(goal.id);
    }
  };

  return (
    <div className="dm-page dm-goals-page">
      {/* Header */}
      <div className="dm-page-header">
        <div className="dm-page-title-row">
          <div className="dm-page-title-icon">
            <Target size={21} />
          </div>
          <div>
            <h1>Goals</h1>
            <p>Set meaningful targets and build consistent habits.</p>
          </div>
        </div>

        <Button onClick={openCreateModal}>
          <Plus size={18} />
          Create goal
        </Button>
      </div>

      {/* Goal statistics */}
      <div className="dm-stats-grid dm-goal-stats">
        <div className="dm-goal-stat">
          <span className="dm-goal-stat-label">Total goals</span>
          <strong>{goalStats.total}</strong>
          <span className="dm-goal-stat-icon"><Target size={19} /></span>
        </div>
        <div className="dm-goal-stat">
          <span className="dm-goal-stat-label">Active</span>
          <strong>{goalStats.active}</strong>
          <span className="dm-goal-stat-icon"><Target size={19} /></span>
        </div>
        <div className="dm-goal-stat">
          <span className="dm-goal-stat-label">Completed</span>
          <strong>{goalStats.completed}</strong>
          <span className="dm-goal-stat-icon"><CheckCircle2 size={19} /></span>
        </div>
        <div className="dm-goal-stat">
          <span className="dm-goal-stat-label">Paused</span>
          <strong>{goalStats.paused}</strong>
          <span className="dm-goal-stat-icon"><CirclePause size={19} /></span>
        </div>
      </div>

      {/* Filters */}
      <div className="dm-goals-toolbar">
        <div className="dm-goal-filters">
          {["ALL", "ACTIVE", "COMPLETED", "PAUSED", "ARCHIVED"].map((f) => (
            <button
              key={f}
              type="button"
              className={filter === f ? "is-active" : ""}
              onClick={() => setFilter(f)}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="dm-goal-count">
          {filteredGoals.length} {filteredGoals.length === 1 ? "goal" : "goals"}
        </span>
      </div>

      {/* Goals */}
      <GoalList
        goals={filteredGoals}
        onEdit={openEditModal}
        onPause={handlePause}
        onComplete={handleComplete}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onCreate={openCreateModal}
      />

      {/* Create / Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGoal ? "Edit goal" : "Create goal"}
        description={
          editingGoal
            ? "Update your goal details."
            : "Define a target you want to work towards."
        }
      >
        <GoalForm
          initialData={editingGoal}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

export default Goals;

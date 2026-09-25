import { useMemo, useState } from "react";
import { Plus, Activity as ActivityIcon } from "lucide-react";

import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ActivityForm from "../components/activities/ActivityForm";
import ActivityList from "../components/activities/ActivityList";
import ActivityFilter from "../components/activities/ActivityFilter";
import { useApp } from "../context/AppContext";

function Activities() {
  const { activities, addActivity, updateActivity, deleteActivity } = useApp();

  const [category, setCategory] = useState("ALL");
  const [date, setDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const categoryMatches =
        category === "ALL" ||
        activity.category === category ||
        activity.activity?.category === category;

      const loggedAt = activity.loggedAt;
      const dateMatches = !date || (loggedAt && loggedAt.startsWith(date));

      return categoryMatches && dateMatches;
    });
  }, [activities, category, date]);

  const openCreateModal = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleSubmit = async (activityData) => {
    if (editingActivity) {
      await updateActivity(editingActivity.id, activityData);
    } else {
      await addActivity(activityData);
    }
    closeModal();
  };

  const handleDelete = async (activity) => {
    const confirmed = window.confirm(`Delete this activity log?`);
    if (confirmed) {
      await deleteActivity(activity.id);
    }
  };

  const clearFilters = () => {
    setCategory("ALL");
    setDate("");
  };

  const hasFilters = category !== "ALL" || date !== "";

  return (
    <div className="dm-page">
      <div className="dm-page-header">
        <div>
          <div className="dm-page-title-row">
            <div className="dm-page-title-icon">
              <ActivityIcon size={21} />
            </div>
            <div>
              <h1>Activities</h1>
              <p>Log and manage your daily activities.</p>
            </div>
          </div>
        </div>

        <Button onClick={openCreateModal}>
          <Plus size={18} />
          Add activity
        </Button>
      </div>

      <div className="dm-page-content">
        <ActivityFilter
          category={category}
          setCategory={setCategory}
          date={date}
          setDate={setDate}
        />

        <div className="dm-section-header">
          <div>
            <h2>Activity history</h2>
            <p>
              {filteredActivities.length}{" "}
              {filteredActivities.length === 1 ? "activity" : "activities"} found
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="dm-text-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        <ActivityList
          activities={filteredActivities}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingActivity ? "Edit activity" : "Add activity"}
        description={
          editingActivity
            ? "Update the details of your activity."
            : "Record an activity to keep your DayMark history updated."
        }
      >
        <ActivityForm
          activity={editingActivity}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

export default Activities;

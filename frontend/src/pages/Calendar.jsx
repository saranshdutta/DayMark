import { useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";

import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ActivityForm from "../components/activities/ActivityForm";
import CalendarView from "../components/calendar/Calendar";
import DayActivities from "../components/calendar/DayActivities";
import EmptyState from "../components/common/EmptyState";
import { useApp } from "../context/AppContext";



function Calendar() {
  const { activities, addActivity } = useApp();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addError, setAddError] = useState("");

  const displayActivities = activities;

  /*
   * Convert the activity array into the structure
   * expected by the Calendar component:
   *
   * {
   *   "2026-09-19": 2,
   *   "2026-09-18": 1
   * }
   */
  const activityDays = useMemo(() => {
    return displayActivities.reduce((result, activity) => {
      if (!activity.loggedAt) {
        return result;
      }

      const dateKey = activity.loggedAt.split("T")[0];

      result[dateKey] = (result[dateKey] || 0) + 1;

      return result;
    }, {});
  }, [displayActivities]);

  const selectedDayActivities = useMemo(() => {
    return displayActivities.filter((activity) =>
      activity.loggedAt?.startsWith(selectedDate),
    );
  }, [displayActivities, selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddActivity = async (activityData) => {
    setAddError("");
    try {
      await addActivity({
        ...activityData,
        loggedAt: activityData.loggedAt || `${selectedDate}T${new Date().toTimeString().split(" ")[0]}`,
      });
      setIsModalOpen(false);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to save activity. Please try again.";
      setAddError(message);
    }
  };

  return (
    <div className="dm-page">
      <div className="dm-page-header">
        <div className="dm-page-title-row">
          <div className="dm-page-title-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <h1>Calendar</h1>
            <p>View your activities and daily consistency.</p>
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add activity
        </Button>
      </div>

      {displayActivities.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No activities yet"
          message="Log an activity to see it on your calendar."
        />
      ) : (
        <div className="dm-calendar-page-grid">
          <CalendarView
            activities={activityDays}
            onDateSelect={handleDateSelect}
          />

          <DayActivities date={selectedDate} activities={selectedDayActivities} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setAddError(""); }}
        title="Add activity"
        description={`Log an activity for ${selectedDate}.`}
      >
        {addError && (
          <div className="dm-form-error" style={{ marginBottom: "1rem" }}>
            {addError}
          </div>
        )}
        <ActivityForm
          onSubmit={handleAddActivity}
          onCancel={() => { setIsModalOpen(false); setAddError(""); }}
        />
      </Modal>
    </div>
  );
}

export default Calendar;

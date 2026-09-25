import { useState } from "react";
import { Target, Hash, Ruler, CalendarDays } from "lucide-react";
import Button from "../common/Button";

// Backend schema: title, targetValue, unit, frequency, startDate, endDate, activityId (optional)

function GoalForm({ initialData = null, onSubmit, onCancel }) {
  const goal = initialData; // alias for clarity

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: goal?.title || "",
    targetValue: goal?.targetValue ?? goal?.target ?? "",
    unit: goal?.unit || "",
    frequency: goal?.frequency || "DAILY",
    startDate: goal?.startDate
      ? new Date(goal.startDate).toISOString().split("T")[0]
      : today,
    endDate: goal?.endDate
      ? new Date(goal.endDate).toISOString().split("T")[0]
      : "",
  });

  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a goal title.");
      return;
    }
    if (form.targetValue === "" || Number(form.targetValue) <= 0) {
      setError("Please enter a valid target.");
      return;
    }
    if (!form.unit.trim()) {
      setError("Please enter a unit.");
      return;
    }
    if (!form.startDate) {
      setError("Please enter a start date.");
      return;
    }
    if (form.endDate && form.endDate < form.startDate) {
      setError("End date cannot be earlier than the start date.");
      return;
    }

    onSubmit?.({
      title: form.title.trim(),
      targetValue: Number(form.targetValue),
      unit: form.unit.trim(),
      frequency: form.frequency,
      startDate: form.startDate,
      endDate: form.endDate || null,
    });
  };

  return (
    <form className="dm-form dm-goal-form" onSubmit={handleSubmit}>
      <div className="dm-form-group">
        <label htmlFor="goal-title">Goal title</label>
        <div className="dm-input-with-icon">
          <Target size={18} />
          <input
            id="goal-title"
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Walk 10,000 steps"
            required
          />
        </div>
      </div>

      <div className="dm-form-grid">
        <div className="dm-form-group">
          <label htmlFor="goal-target">Target</label>
          <div className="dm-input-with-icon">
            <Hash size={18} />
            <input
              id="goal-target"
              type="number"
              min="0"
              step="any"
              value={form.targetValue}
              onChange={(e) => updateField("targetValue", e.target.value)}
              placeholder="e.g. 10000"
              required
            />
          </div>
        </div>

        <div className="dm-form-group">
          <label htmlFor="goal-unit">Unit</label>
          <div className="dm-input-with-icon">
            <Ruler size={18} />
            <input
              id="goal-unit"
              type="text"
              value={form.unit}
              onChange={(e) => updateField("unit", e.target.value)}
              placeholder="steps, minutes, L..."
              required
            />
          </div>
        </div>
      </div>

      <div className="dm-form-group">
        <label htmlFor="goal-frequency">Frequency</label>
        <select
          id="goal-frequency"
          value={form.frequency}
          onChange={(e) => updateField("frequency", e.target.value)}
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
      </div>

      <div className="dm-form-grid">
        <div className="dm-form-group">
          <label htmlFor="goal-start-date">Start date</label>
          <div className="dm-input-with-icon">
            <CalendarDays size={18} />
            <input
              id="goal-start-date"
              type="date"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="dm-form-group">
          <label htmlFor="goal-end-date">End date</label>
          <div className="dm-input-with-icon">
            <CalendarDays size={18} />
            <input
              id="goal-end-date"
              type="date"
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      <small className="dm-form-hint">
        Leave end date empty if you want the goal to continue indefinitely.
      </small>

      {error && <div className="dm-form-error">{error}</div>}

      <div className="dm-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{goal ? "Update goal" : "Create goal"}</Button>
      </div>
    </form>
  );
}

export default GoalForm;

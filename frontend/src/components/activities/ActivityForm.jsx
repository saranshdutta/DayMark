import { useEffect, useState } from "react";
import { Activity, Clock3, FileText, Tag, Plus } from "lucide-react";
import Button from "../common/Button";
import activityService from "../../services/activityService";

function ActivityForm({ activity = null, onSubmit, onCancel }) {
  // `activity` here is an ActivityLog record when editing
  const [activities, setActivities] = useState([]); // Activity definitions from backend
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Mode: "pick" = select existing Activity def, "new" = create new Activity def inline
  const [mode, setMode] = useState("pick");

  const [form, setForm] = useState({
    activityId: activity?.activityId || "",
    // For creating a new activity definition
    newActivityName: activity?.activity?.name || "",
    newActivityCategory: activity?.activity?.category || "PHYSICAL",
    newActivityUnit: activity?.activity?.unit || "",
    // Log fields
    value: activity?.value ?? "",
    duration: activity?.duration ?? "",
    note: activity?.note || "",
    loggedAt: activity?.loggedAt
      ? new Date(activity.loggedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getActivities();
        setActivities(Array.isArray(data) ? data : []);
        // If editing, pre-select the activity
        if (activity?.activityId) {
          setForm((prev) => ({ ...prev, activityId: activity.activityId }));
          setMode("pick");
        }
      } catch {
        setActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchActivities();
  }, [activity?.activityId]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      let resolvedActivityId = form.activityId;

      if (mode === "new") {
        if (!form.newActivityName.trim()) {
          setError("Please enter an activity name.");
          setSubmitting(false);
          return;
        }
        if (!form.newActivityUnit.trim()) {
          setError("Please enter a unit (e.g. steps, pages, L).");
          setSubmitting(false);
          return;
        }
        // Create the Activity definition first
        const newActivity = await activityService.createActivity({
          name: form.newActivityName.trim(),
          category: form.newActivityCategory,
          unit: form.newActivityUnit.trim(),
        });
        resolvedActivityId = newActivity.id;
      }

      if (!resolvedActivityId) {
        setError("Please select an activity.");
        setSubmitting(false);
        return;
      }

      if (form.value === "" && form.duration === "") {
        setError("Enter a value or duration for the activity.");
        setSubmitting(false);
        return;
      }

      const logData = {
        activityId: resolvedActivityId,
        value: form.value === "" ? null : Number(form.value),
        duration: form.duration === "" ? null : Number(form.duration),
        note: form.note.trim() || null,
        loggedAt: form.loggedAt ? new Date(form.loggedAt).toISOString() : new Date().toISOString(),
      };

      onSubmit?.(logData);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save activity.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedActivity = activities.find((a) => a.id === form.activityId);

  return (
    <form className="dm-form dm-activity-form" onSubmit={handleSubmit}>
      {/* Activity selection */}
      <div className="dm-form-group">
        <div className="dm-form-label-row">
          <label>Activity</label>
          <button
            type="button"
            className="dm-text-button"
            onClick={() => setMode(mode === "pick" ? "new" : "pick")}
          >
            {mode === "pick" ? (
              <>
                <Plus size={13} /> Create new
              </>
            ) : (
              "← Pick existing"
            )}
          </button>
        </div>

        {mode === "pick" ? (
          <div className="dm-input-with-icon">
            <Activity size={18} />
            {loadingActivities ? (
              <select disabled>
                <option>Loading activities…</option>
              </select>
            ) : (
              <select
                id="activity-id"
                value={form.activityId}
                onChange={(e) => updateField("activityId", e.target.value)}
                required
              >
                <option value="">Select an activity…</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.unit}) — {a.category}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <>
            <div className="dm-input-with-icon" style={{ marginBottom: 8 }}>
              <Activity size={18} />
              <input
                id="activity-name"
                type="text"
                value={form.newActivityName}
                onChange={(e) => updateField("newActivityName", e.target.value)}
                placeholder="e.g. Walking, Studying, Reading"
              />
            </div>
            <div className="dm-form-grid">
              <div className="dm-form-group">
                <label htmlFor="activity-category">Category</label>
                <div className="dm-input-with-icon">
                  <Tag size={18} />
                  <select
                    id="activity-category"
                    value={form.newActivityCategory}
                    onChange={(e) => updateField("newActivityCategory", e.target.value)}
                  >
                    <option value="PHYSICAL">Physical</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="LIFESTYLE">Lifestyle</option>
                    <option value="SOCIAL">Social</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>
              <div className="dm-form-group">
                <label htmlFor="activity-unit">Unit</label>
                <input
                  id="activity-unit"
                  type="text"
                  value={form.newActivityUnit}
                  onChange={(e) => updateField("newActivityUnit", e.target.value)}
                  placeholder="steps, pages, L…"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Value + Unit display */}
      <div className="dm-form-grid">
        <div className="dm-form-group">
          <label htmlFor="activity-value">
            Value{selectedActivity ? ` (${selectedActivity.unit})` : ""}
          </label>
          <input
            id="activity-value"
            type="number"
            min="0"
            step="any"
            value={form.value}
            onChange={(e) => updateField("value", e.target.value)}
            placeholder="e.g. 5000"
          />
        </div>

        <div className="dm-form-group">
          <label htmlFor="activity-duration">Duration (min)</label>
          <div className="dm-input-with-icon">
            <Clock3 size={18} />
            <input
              id="activity-duration"
              type="number"
              min="0"
              step="1"
              value={form.duration}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder="Minutes"
            />
          </div>
        </div>
      </div>

      {/* Date/time */}
      <div className="dm-form-group">
        <label htmlFor="activity-logged-at">Date &amp; time</label>
        <input
          id="activity-logged-at"
          type="datetime-local"
          value={form.loggedAt}
          onChange={(e) => updateField("loggedAt", e.target.value)}
        />
      </div>

      {/* Note */}
      <div className="dm-form-group">
        <label htmlFor="activity-note">Note</label>
        <div className="dm-textarea-with-icon">
          <FileText size={18} />
          <textarea
            id="activity-note"
            value={form.note}
            onChange={(e) => updateField("note", e.target.value)}
            placeholder="Add an optional note..."
            rows={3}
          />
        </div>
      </div>

      {error && <div className="dm-form-error">{error}</div>}

      <div className="dm-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {activity ? "Update activity" : "Save activity"}
        </Button>
      </div>
    </form>
  );
}

export default ActivityForm;

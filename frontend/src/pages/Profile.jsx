import { useMemo, useState, useEffect } from "react";
import {
  User,
  Mail,
  CalendarDays,
  Activity,
  Target,
  Flame,
  Clock3,
  Pencil,
  Save,
  X,
} from "lucide-react";

import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import analyticsService from "../services/analyticsService";

function Profile() {
  const { user, updateUser } = useAuth();
  const { activities, goals } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchStreak = async () => {
      try {
        const res = await analyticsService.getStreak();
        if (isMounted && res) {
          setStreak(res.current || 0);
        }
      } catch (error) {
        console.error("Failed to fetch streak:", error);
      }
    };
    fetchStreak();
    return () => { isMounted = false; };
  }, []);

  const displayName = user?.name || "Student";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profileStats = useMemo(() => {
    const totalActivities = activities.length;

    const totalDuration = activities.reduce(
      (total, activity) => total + (Number(activity.duration) || 0),
      0,
    );

    const totalGoals = goals.length;

    return {
      totalActivities,
      totalDuration,
      totalGoals,
    };
  }, [activities, goals]);

  const formattedDuration =
    profileStats.totalDuration >= 60
      ? `${Math.floor(profileStats.totalDuration / 60)}h ${
          profileStats.totalDuration % 60
        }m`
      : `${profileStats.totalDuration}m`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      return;
    }

    const result = await updateUser?.({
      name: trimmedName,
      email: formData.email.trim(),
    });

    if (result?.success !== false) {
      setIsEditing(false);
    } else {
      // optionally show an error message
    }
  };

  return (
    <div className="dm-page dm-profile-page">
      {/* Page header */}
      <div className="dm-page-header">
        <div className="dm-page-title-row">
          <div className="dm-page-title-icon">
            <User size={21} />
          </div>

          <div>
            <h1>Profile</h1>
            <p>
              Manage your personal information and view your DayMark activity.
            </p>
          </div>
        </div>

        {!isEditing ? (
          <Button variant="secondary" onClick={handleEdit}>
            <Pencil size={17} />
            Edit profile
          </Button>
        ) : (
          <div className="dm-profile-edit-actions">
            <Button variant="secondary" onClick={handleCancel}>
              <X size={17} />
              Cancel
            </Button>

            <Button onClick={handleSave}>
              <Save size={17} />
              Save changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile overview */}
      <section className="dm-profile-overview">
        <div className="dm-profile-avatar">{initials || "S"}</div>

        <div className="dm-profile-identity">
          <h2>{displayName}</h2>

          <div className="dm-profile-email">
            <Mail size={16} />
            <span>{user?.email || "student@example.com"}</span>
          </div>

          <div className="dm-profile-member">
            <CalendarDays size={16} />
            <span>DayMark member</span>
          </div>
        </div>
      </section>

      {/* Profile information */}
      <section className="dm-profile-section">
        <div className="dm-section-heading">
          <div>
            <h2>Personal information</h2>
            <p>Your basic account details.</p>
          </div>
        </div>

        <div className="dm-profile-form">
          <div className="dm-form-group">
            <label htmlFor="profile-name">Full name</label>

            <div className="dm-profile-input-wrapper">
              <User size={17} />

              <input
                id="profile-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="dm-form-group">
            <label htmlFor="profile-email">Email address</label>

            <div className="dm-profile-input-wrapper">
              <Mail size={17} />

              <input
                id="profile-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activity overview */}
      <section className="dm-profile-section">
        <div className="dm-section-heading">
          <div>
            <h2>Activity overview</h2>
            <p>A quick look at your DayMark usage.</p>
          </div>
        </div>

        <div className="dm-profile-stats">
          <div className="dm-profile-stat">
            <div className="dm-profile-stat-icon">
              <Activity size={19} />
            </div>

            <div>
              <span>Activities logged</span>

              <strong>{profileStats.totalActivities}</strong>
            </div>
          </div>

          <div className="dm-profile-stat">
            <div className="dm-profile-stat-icon">
              <Clock3 size={19} />
            </div>

            <div>
              <span>Active time</span>

              <strong>{formattedDuration}</strong>
            </div>
          </div>

          <div className="dm-profile-stat">
            <div className="dm-profile-stat-icon">
              <Target size={19} />
            </div>

            <div>
              <span>Goals created</span>

              <strong>{profileStats.totalGoals}</strong>
            </div>
          </div>

          <div className="dm-profile-stat">
            <div className="dm-profile-stat-icon">
              <Flame size={19} />
            </div>

            <div>
              <span>Current streak</span>

              <strong>{streak} {streak === 1 ? "day" : "days"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Account information */}
      <section className="dm-profile-section dm-profile-account">
        <div className="dm-section-heading">
          <div>
            <h2>Account</h2>
            <p>Information about your DayMark account.</p>
          </div>
        </div>

        <div className="dm-profile-account-row">
          <span>Account status</span>
          <span className="dm-account-status">Active</span>
        </div>

        <div className="dm-profile-account-row">
          <span>Account type</span>
          <span>Student</span>
        </div>
      </section>
    </div>
  );
}

export default Profile;

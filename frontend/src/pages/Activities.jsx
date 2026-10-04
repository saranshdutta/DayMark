import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ListTodo,
  Plus,
  Search,
  BookOpen,
  Activity as HealthIcon,
  User as PersonalIcon,
  Users as SocialIcon,
  Briefcase as WorkIcon,
  Compass,
  Clock,
  Trash2,
  Edit2,
  Calendar,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { Button, IconButton } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Badge } from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ActivityFormModal from "../components/activities/ActivityFormModal";

import { useApp } from "../context/AppContext";

const categoryIcons = {
  ACADEMIC: BookOpen,
  HEALTH: HealthIcon,
  PERSONAL: PersonalIcon,
  SOCIAL: SocialIcon,
  WORK: WorkIcon,
  PHYSICAL: HealthIcon,
  LIFESTYLE: PersonalIcon,
  OTHER: Compass,
  CUSTOM: Compass,
};

const categoryBadges = {
  ACADEMIC: "primary",
  HEALTH:   "success",
  PHYSICAL: "success",
  PERSONAL: "info",
  LIFESTYLE: "warning",
  SOCIAL:   "warning",
  WORK:     "default",
  OTHER:    "default",
  CUSTOM:   "default",
};

const categoryIconColors = {
  ACADEMIC:  { bg: "var(--dm-primary-soft)",  color: "var(--dm-primary)"  },
  HEALTH:    { bg: "var(--dm-success-soft)",  color: "var(--dm-success)"  },
  PHYSICAL:  { bg: "var(--dm-success-soft)",  color: "var(--dm-success)"  },
  PERSONAL:  { bg: "var(--dm-info-soft)",     color: "var(--dm-info)"     },
  LIFESTYLE: { bg: "var(--dm-warning-soft)",  color: "var(--dm-warning)"  },
  SOCIAL:    { bg: "var(--dm-warning-soft)",  color: "var(--dm-warning)"  },
  WORK:      { bg: "var(--dm-surface-subtle)",color: "var(--dm-text-secondary)" },
  OTHER:     { bg: "var(--dm-surface-subtle)",color: "var(--dm-text-muted)"    },
  CUSTOM:    { bg: "var(--dm-primary-soft)",  color: "var(--dm-primary)"  },
};

function Activities() {
  const { activities, deleteActivity } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const title = item.title || item.activity?.name || "";
      const cat = item.category || item.activity?.category || "OTHER";

      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || cat === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activities, searchQuery, selectedCategory]);

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await deleteActivity(deletingId);
      setDeletingId(null);
    }
  };

  const formatDuration = (mins) => {
    if (!mins) return "0m";
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}>
      {/* Page Header */}
      <PageHeader
        title="Activities"
        subtitle="Track the things that shape your day."
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingActivity(null);
              setModalOpen(true);
            }}
          >
            Log activity
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <div
        className="dm-card"
        style={{
          padding: "var(--dm-space-4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--dm-space-3)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "240px" }}>
          <div className="dm-input-wrapper">
            <Search className="dm-input-icon" size={16} />
            <input
              type="text"
              className="dm-input dm-input-with-icon"
              placeholder="Search activities by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: "180px" }}
          >
            <option value="ALL">All Categories</option>
            <option value="ACADEMIC">Academic</option>
            <option value="HEALTH">Health & Fitness</option>
            <option value="PERSONAL">Personal Habit</option>
            <option value="SOCIAL">Social & Community</option>
            <option value="WORK">Work / Projects</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No activities yet"
          message="Start tracking your day and build your personal activity history."
          actionLabel="Log your first activity"
          onAction={() => {
            setEditingActivity(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-3)" }}>
          {filteredActivities.map((item) => {
            const title = item.title || item.activity?.name || "Activity";
            const category = item.category || item.activity?.category || "OTHER";
            const Icon = categoryIcons[category] || Compass;

            return (
              <div
                key={item.id}
                className="dm-card dm-card-interactive"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--dm-space-4) var(--dm-space-5)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-4)" }}>
                  {/* Category Icon Marker */}
                  {(() => {
                    const iconStyle = categoryIconColors[category] || categoryIconColors.OTHER;
                    return (
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "var(--dm-radius-sm)",
                          backgroundColor: iconStyle.bg,
                          color: iconStyle.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                    );
                  })()}

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-2)" }}>
                      <h3 style={{ fontSize: "var(--dm-text-base)", fontWeight: "var(--dm-weight-semibold)" }}>
                        {title}
                      </h3>
                      <Badge variant={categoryBadges[category] || "default"}>
                        {category}
                      </Badge>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)", marginTop: "4px", fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} /> {formatDate(item.date || item.createdAt)}
                      </span>
                      {item.startTime && <span>• {item.startTime}</span>}
                      {item.notes && <span style={{ fontStyle: "italic" }}>— "{item.notes}"</span>}
                    </div>
                  </div>
                </div>

                {/* Duration & Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-4)" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "var(--dm-text-sm)", fontWeight: "var(--dm-weight-semibold)", color: "var(--dm-text-primary)" }}>
                      <Clock size={14} style={{ color: "var(--dm-text-muted)" }} />
                      {formatDuration(item.duration)}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-1)" }}>
                    <IconButton
                      icon={Edit2}
                      size="sm"
                      title="Edit activity"
                      onClick={() => handleEdit(item)}
                    />
                    <IconButton
                      icon={Trash2}
                      size="sm"
                      title="Delete activity"
                      onClick={() => setDeletingId(item.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity Creation/Edit Modal */}
      <ActivityFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingActivity(null);
        }}
        initialData={editingActivity}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity"
        message="Are you sure you want to remove this activity log? This cannot be undone."
        confirmText="Delete Activity"
      />
    </div>
  );
}

export default Activities;

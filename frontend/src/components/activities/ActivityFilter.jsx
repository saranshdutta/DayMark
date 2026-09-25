import { Filter, X } from "lucide-react";

function ActivityFilter({ category = "ALL", setCategory, date = "", setDate }) {
  const hasFilters = category !== "ALL" || date !== "";

  const clearFilters = () => {
    setCategory?.("ALL");
    setDate?.("");
  };

  return (
    <div className="dm-activity-filter">
      <div className="dm-filter-label">
        <Filter size={17} />
        <span>Filter</span>
      </div>

      <select
        value={category}
        onChange={(event) => setCategory?.(event.target.value)}
      >
        <option value="ALL">All categories</option>
        <option value="PHYSICAL">Physical</option>
        <option value="ACADEMIC">Academic</option>
        <option value="LIFESTYLE">Lifestyle</option>
        <option value="CUSTOM">Custom</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(event) => setDate?.(event.target.value)}
      />

      {hasFilters && (
        <button
          type="button"
          className="dm-clear-filter"
          onClick={clearFilters}
        >
          <X size={15} />
          Clear
        </button>
      )}
    </div>
  );
}

export default ActivityFilter;

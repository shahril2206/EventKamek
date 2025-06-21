import React, { useState, useEffect } from 'react';

const FilterEventsSection = ({ view, role, events, onFilter }) => {
  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    searchTerm: '',
    status: { upcoming: true, ongoing: true, past: false },
    startDate: today,
    endDate: '',
    sortBy: 'date_ascending',
    myOnly: false,
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    let filtered = [...events];
    const now = new Date();

    const { searchTerm, status, startDate, endDate, sortBy, myOnly } = appliedFilters;

    // Search filter
    // Enhanced Search: check eventname, location, organizationname, organizeremail
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filtered = filtered.filter(e =>
      (e.eventname && e.eventname.toLowerCase().includes(lower)) ||
      (e.eventlocation && e.eventlocation.toLowerCase().includes(lower)) ||
      (e.organizationname && e.organizationname.toLowerCase().includes(lower)) ||
      (e.organizeremail && e.organizeremail.toLowerCase().includes(lower))
    );
  }

    // Status filter
    filtered = filtered.filter(event => {
      const start = new Date(event.eventstartdate);
      const end = new Date(event.eventenddate);
      const isUpcoming = start > now;
      const isOngoing = start <= now && end >= now;
      const isPast = end < now;
      return (
        (status.upcoming && isUpcoming) ||
        (status.ongoing && isOngoing) ||
        (status.past && isPast)
      );
    });

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(e => new Date(e.eventstartdate) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(e => new Date(e.eventstartdate) <= new Date(endDate));
    }

    // Role filter
    if (myOnly && role && role !== "") {
      const userEmail = localStorage.getItem("email");
      filtered = filtered.filter(e => e.organizeremail === userEmail);
    }

    // Sorting
    if (sortBy === "date_ascending") {
      filtered.sort((a, b) => new Date(a.eventstartdate) - new Date(b.eventstartdate));
    } else if (sortBy === "date_descending") {
      filtered.sort((a, b) => new Date(b.eventstartdate) - new Date(a.eventstartdate));
    }

    onFilter(filtered);
  }, [appliedFilters, events]);

  const handleReset = () => {
    const reset = {
      searchTerm: '',
      status: { upcoming: true, ongoing: true, past: false },
      startDate: today,
      endDate: '',
      sortBy: 'date_ascending',
      myOnly: false,
    };
    setFilters(reset);
    setAppliedFilters(reset);
  };

  return (
    <div className="event-filter-section">
      <input
        type="text"
        className={`event-searchbar ${view === 'map' ? 'event-searchbar-wide' : ''}`}
        placeholder="Enter keywords here..."
        value={filters.searchTerm}
        onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
        aria-label="Search events"
      />

      <div className="filter-sort-panel">
        <div className="event-status-filter">
          <label className="font-bold">Status:</label>&nbsp;
          Upcoming
          <input
            type="checkbox"
            checked={filters.status.upcoming}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                status: { ...prev.status, upcoming: e.target.checked },
              }))
            }
          />&nbsp;
          Ongoing
          <input
            type="checkbox"
            checked={filters.status.ongoing}
            onChange={e =>
              setFilters(prev => ({
                ...prev,
                status: { ...prev.status, ongoing: e.target.checked },
              }))
            }
          />&nbsp;
          Past
          <input
            type="checkbox"
            checked={filters.status.past}
            onChange={e => {
              const isChecked = e.target.checked;
              setFilters(prev => ({
                ...prev,
                status: { ...prev.status, past: isChecked },
                ...(isChecked ? { startDate: '', endDate: '' } : {})
              }));
            }}
          />

        </div>

        <div>
          <label className="font-bold">Date Range:</label>&nbsp;
          <input
            type="date"
            className="event-date-filter"
            value={filters.startDate}
            onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            aria-label="Start date"
          />
          &nbsp;<strong>-</strong>&nbsp;
          <input
            type="date"
            className="event-date-filter"
            value={filters.endDate}
            onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            aria-label="End date"
          />
        </div>

        {view === 'list' && (
          <div>
            <select
              className="event-location-filter"
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              aria-label="Sort events"
            >
              <option value="date_ascending">Date Ascending</option>
              <option value="date_descending">Date Descending</option>
              <option value="distance_ascending" disabled>Nearest</option>
            </select>
          </div>
        )}

        {role && (
          <div>
            <label>
              {role === "organizer" ? "My Events only" : "My Involvements only"}
              <input
                type="checkbox"
                checked={filters.myOnly}
                onChange={e => setFilters(prev => ({ ...prev, myOnly: e.target.checked }))}
              />
            </label>
          </div>
        )}
      </div>

      <button
        className="apply-filter-btn"
        type="button"
        aria-label="Apply filters"
        onClick={() => setAppliedFilters(filters)}
      >
        Apply
      </button>

      <button
        className="reset-filter-btn"
        type="button"
        aria-label="Reset filters"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};

export default FilterEventsSection;

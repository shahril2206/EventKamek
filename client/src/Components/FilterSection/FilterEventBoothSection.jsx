import React, { useState, useEffect } from 'react';

const FilterEventBoothSection = ({ filter, setFilter }) => {
  const [tempFilter, setTempFilter] = useState(filter);

  useEffect(() => {
    setTempFilter(filter); // Keep in sync if parent resets
  }, [filter]);

  const handleChange = (field, value) => {
    setTempFilter(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (statusName) => {
    setTempFilter(prev => {
        const updatedStatus = {
        ...prev.status,
        [statusName]: !prev.status[statusName],
        };

        const shouldClearFromDate = statusName === 'past' && updatedStatus.past === true;

        return {
        ...prev,
        status: updatedStatus,
        fromDate: shouldClearFromDate ? '' : prev.fromDate,
        };
    });
    };

  const handleApply = () => {
    setFilter(tempFilter); // Send to parent only when Apply is clicked
  };

  const today = new Date().toISOString().split("T")[0];

  const handleReset = () => {
    const defaultFilter = {
      keyword: '',
      fromDate: today,
      toDate: '',
      sortOrder: 'asc',
      status: {
        upcoming: true,
        ongoing: true,
        past: false,
      },
      showFullyBooked: true,
    };
    setTempFilter(defaultFilter);
    setFilter(defaultFilter); // Apply reset immediately
  };

  return (
    <div className="event-filter-section">
      <input
        type="text"
        className="eventbooth-searchbar"
        placeholder="Search event name or venue..."
        value={tempFilter.keyword}
        onChange={(e) => handleChange('keyword', e.target.value)}
      />
      <div className="filter-sort-panel">
        <div>
          <label className="font-bold">From:</label>
          <input
            type="date"
            className="event-date-filter"
            value={tempFilter.fromDate}
            onChange={(e) => handleChange('fromDate', e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold">To:</label>
          <input
            type="date"
            className="event-date-filter"
            value={tempFilter.toDate}
            onChange={(e) => handleChange('toDate', e.target.value)}
          />
        </div>
        <div>
          <select
            className="event-sort-filter"
            value={tempFilter.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
          >
            <option value="asc">Date Ascending</option>
            <option value="desc">Date Descending</option>
          </select>
        </div>
        <div className="event-status-filter">
          <label className="font-bold">Status:</label>&nbsp;
          Upcoming
          <input
            type="checkbox"
            checked={tempFilter.status.upcoming}
            onChange={() => handleStatusChange('upcoming')}
          />
          &nbsp;Ongoing
          <input
            type="checkbox"
            checked={tempFilter.status.ongoing}
            onChange={() => handleStatusChange('ongoing')}
          />
          &nbsp;Past
          <input
            type="checkbox"
            checked={tempFilter.status.past}
            onChange={() => handleStatusChange('past')}
          />
        </div>
        <div className="event-fully-booked-filter">
          Show fully booked
          <input
            type="checkbox"
            checked={tempFilter.showFullyBooked}
            onChange={() => handleChange('showFullyBooked', !tempFilter.showFullyBooked)}
          />
        </div>
      </div>
      <button className="apply-filter-btn" onClick={handleApply}>
        Apply
      </button>
      <button className="reset-filter-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default FilterEventBoothSection;

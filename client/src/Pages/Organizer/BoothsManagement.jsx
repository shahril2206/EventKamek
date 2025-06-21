import React, { useState } from 'react';
import FilterEventBoothSection from '../../Components/FilterSection/FilterEventBoothSection';
import MyEventsList from '../../Components/Organizer/MyEventsList';
import useStickyHeaderEffect from '../../hooks/useStickyHeaderEffect';

const BoothsManagement = () => {
  useStickyHeaderEffect();

  const today = new Date().toISOString().split("T")[0];

  const [filter, setFilter] = useState({
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
  });

  return (
    <main>
      <div id="sentinel" className="h-[1px]"></div>
      <div className="heading-container">
        <h1>Booths Management</h1>
      </div>
      <div className="content-container">
        <div className="events-container">
          <FilterEventBoothSection filter={filter} setFilter={setFilter} />
          <div className="my-events-list">
            <MyEventsList filter={filter} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default BoothsManagement;

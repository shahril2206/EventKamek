import React, { useState } from 'react';
import FilterMyBoothSection from '../../Components/FilterSection/FilterMyBoothSection';
import MyBoothTable from '../../Components/Vendor/MyBoothTable';
import useStickyHeaderEffect from '../../hooks/useStickyHeaderEffect';

const MyBooths = () => {
  useStickyHeaderEffect();

  const [filter, setFilter] = useState({
    keyword: '',
    fromDate: '',
    toDate: '',
    sortOrder: 'asc',
    status: {
      upcoming: true,
      ongoing: true,
      past: false,
    },
  });

  return (
    <main>
      <div id="sentinel" className="h-[1px]"></div>
      <div className="heading-container">
        <h1>My Booths</h1>
      </div>
      <div className="content-container">
        <div className="events-container">
          <FilterMyBoothSection filter={filter} setFilter={setFilter} />
          <div className="my-booths-list">
            <MyBoothTable filter={filter} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyBooths;

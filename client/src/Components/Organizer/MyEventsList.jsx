import React, { useState, useEffect } from 'react';

const MyEventsList = ({ filter }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/eventsbooth?email=${encodeURIComponent(email)}`);
        const text = await response.text();
        console.log('📦 Raw response:', text);

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch (parseError) {
          console.error('❌ JSON parse failed:', parseError);
          return;
        }

        if (!Array.isArray(parsed)) {
          console.error('❌ Events is not an array:', parsed);
          return;
        }

        setEvents(parsed);
      } catch (err) {
        console.error('❌ Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let result = [...events];

    if (filter.keyword) {
    const keyword = filter.keyword.toLowerCase();
    result = result.filter(event =>
        event.eventname?.toLowerCase().includes(keyword) ||
        event.eventlocation?.toLowerCase().includes(keyword)
    );
    }

    if (filter.fromDate) {
      result = result.filter(event => new Date(event.eventstartdate) >= new Date(filter.fromDate));
    }

    if (filter.toDate) {
      result = result.filter(event => new Date(event.eventstartdate) <= new Date(filter.toDate));
    }

    result = result.filter(event => {
      const status = event.status?.toLowerCase();
      return filter.status[status];
    });

    if (!filter.showFullyBooked) {
      result = result.filter(event => event.bookedbooths < event.boothslots);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.eventstartdate);
      const dateB = new Date(b.eventstartdate);
      return filter.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredEvents(result);
  }, [filter, events]);

  const handleRowClick = (slug) => {
    window.location.href = `/BoothsManagement/${slug}`;
  };

  if (loading) return <div>⏳ Loading events...</div>;

  return (
    <table className="my-events-table">
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Event Date</th>
          <th>Venue</th>
          <th>Status</th>
          <th>Booths</th>
        </tr>
      </thead>
      <tbody>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => {
            let formattedStartDate = '';
            let formattedEndDate = '';

            let statusClass = '';
            let boothsClass = '';

            if (event.status === 'Upcoming') statusClass = 'upcoming-event-td';
            else if (event.status === 'Ongoing') statusClass = 'ongoing-event-td';
            else statusClass = 'past-event-td';

            if (event.bookedbooths >= event.boothslots) boothsClass = 'fully-booked-td';

            if (event.eventstartdate) {
              const d = new Date(event.eventstartdate);
              formattedStartDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            }

            if (event.eventenddate) {
              const d = new Date(event.eventenddate);
              formattedEndDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            }

            return (
              <tr key={event.eventid} onClick={() => handleRowClick(event.eventslug)} title="Click to manage booths">
                <td>{event.eventname}</td>
                <td>
                  {formattedStartDate === formattedEndDate
                    ? formattedStartDate
                    : `${formattedStartDate} - ${formattedEndDate}`}
                </td>
                <td>{event.eventlocation}</td>
                <td className={statusClass}>{event.status || '-'}</td>
                <td className={boothsClass}>
                    {event.bookedbooths} / {event.boothslots}
                    {event.bookedbooths >= event.boothslots && (
                        <span className="text-red-600 italic text-xs">&nbsp;(Fully Booked)</span>
                    )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5">No events match your filters.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MyEventsList;

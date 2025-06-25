import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import FilterEventsSection from '../Components/FilterSection/FilterEventsSection';
import EventList from '../Components/EventList';
import EventMap from '../Components/EventMap';
import useStickyHeaderEffect from '../hooks/useStickyHeaderEffect';
import Calendar from '../Components/Calendar';
import { FaPlus } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const Events = () => {
  const [view, setView] = useState('list');
  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token, role, email } = useContext(AuthContext);
  useStickyHeaderEffect();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/events`);
        const data = await response.json();
        setEventsData(data);
        setFilteredEvents(data); // default show all
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main>
      <div id="sentinel" className="h-[1px]"></div>
      <div className="heading-container">
        <h1>Events</h1>
        <button className={`selectViewButton ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
          List View
        </button>
        <button className={`selectViewButton ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
          Map View
        </button>
        {role && (
          <button className={`selectViewButton ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
            Calendar View
          </button>
        )}
        <div className="heading-btn-section">
          {role === 'organizer' && (
            <Link to="/AddEvent">
              <button id="editEvent" className="!bg-green-800 !border-green-800 hover:!text-green-700 hover:!bg-gray-300">
                <FaPlus />&nbsp;Add Event
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="content-container">
        <div className="events-container">
          {view !== 'calendar' && (
            <FilterEventsSection
              view={view}
              role={role}
              events={eventsData}
              onFilter={setFilteredEvents}
            />
          )}

          {loading ? (
            <p>Loading events...</p>
          ) : view === 'list' ? (
            <div className="events-list">
              <EventList events={filteredEvents} />
            </div>
          ) : view === 'map' ? (
            <div className="events-map">
              <EventMap events={filteredEvents} />
            </div>
          ) : view === 'calendar' ? (
            <div className="events-calendar">
              <Calendar events={eventsData} userEmail={email} userRole={role} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default Events;

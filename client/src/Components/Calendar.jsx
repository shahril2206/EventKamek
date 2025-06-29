import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Calendar = ({ events, userEmail, userRole }) => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showMineOnly, setShowMineOnly] = useState(false); // ✅ New state

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const numberDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = firstDayOfMonth.getDay();

  const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(prev => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(prev => prev + 1);
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const generateCalendarCells = () => {
    const cells = [];
    let day = 1;

    for (let row = 0; row < 6; row++) {
      const rowCells = [];

      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < startDay) {
          rowCells.push(<td key={`empty-${col}`} className="td-other-month"></td>);
        } else if (day > numberDays) {
          rowCells.push(<td key={`extra-${col}`} className="td-other-month"></td>);
        } else {
          const currentDate = new Date(`${monthName} ${day} ${currentYear}`);
          currentDate.setHours(0, 0, 0, 0);

          const eventsForDay = events?.filter(e => {
            const eventStart = new Date(e.eventstartdate);
            const eventEnd = new Date(e.eventenddate);

            eventStart.setHours(0, 0, 0, 0);
            eventEnd.setHours(0, 0, 0, 0);

            const isInDateRange = currentDate >= eventStart && currentDate <= eventEnd;

            if (!isInDateRange) return false;

            if (showMineOnly) {
              if (userRole === "organizer" && e.organizeremail !== userEmail) return false;
              if (userRole === "vendor" && e.vendoremail !== userEmail) return false;
            }

            return true;
          }) || [];

          const isToday = (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          );

          rowCells.push(
            <td
              key={day}
              className={`td-day ${isToday ? 'bg-blue-300 border-yellow-600 border-2' : ''}`}
            >
              <h3>{day}</h3>
              {eventsForDay.map((e, i) => (
                <React.Fragment key={i}>
                  <button
                    onClick={() => {
                      setSelectedEvent(e);
                      setShowPopup(true);
                    }}
                  >
                    {e.eventname}
                  </button><br />
                </React.Fragment>
              ))}
            </td>
          );

          day++;
        }
      }

      cells.push(<tr className="calendar-tr" key={row}>{rowCells}</tr>);
      if (day > numberDays) break;
    }

    return cells;
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-controls">
        <div className="flex">
          <h2 className="month-year-heading">{monthName} {currentYear}</h2>
          {(currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) && (
            <button className="goto-currentMonth" onClick={handleCurrentMonth}>Go to Current Month</button>
          )}
          {userRole === "organizer" && (
            <div className="flex items-end !ml-5 !pb-2">
              <label>
                My Events only &nbsp;
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={showMineOnly}
                  onChange={() => setShowMineOnly(prev => !prev)}
                  aria-label="Show my events only"
                />
              </label>
            </div>
          )}
          {userRole === "vendor" && (
            <div className="flex items-end !ml-5 !pb-2">
              <label className="cursor-pointer">
                My Involvements only &nbsp;
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={showMineOnly}
                  onChange={() => setShowMineOnly(prev => !prev)}
                  aria-label="Show my involvements only"
                />
              </label>
            </div>
          )}
        </div>

        <div className="button-section">
          <button onClick={handlePrevMonth}>← Prev Month</button>
          <button onClick={handleNextMonth}>Next Month →</button>
        </div>
      </div>

      <div className="calendar-table-container">
        <table className="calendar-table">
          <thead>
            <tr>
              {daysOfWeek.map((day, idx) => (
                <th key={idx}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{generateCalendarCells()}</tbody>
        </table>
      </div>

      {showPopup && selectedEvent && (
        <>
          <div className="modal-backdrop" onClick={() => setShowPopup(false)}></div>
          <div className="assignment-modal !w-fit">
            <div className="assignment-form-heading !mb-3">
              <h2 className="!mr-10">
                {selectedEvent.eventname}&nbsp;
                <span className="text-gray-500 text-sm font-medium italic underline">
                  ({selectedEvent.status})
                </span>
              </h2>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowPopup(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="flex">
              <div className="flex justify-center !mr-5">
                <img
                  className="w-30 rounded-lg"
                  src={`${import.meta.env.API_BASE}/uploads/eventImages/${selectedEvent.eventimage}`}
                  alt="event"
                />
              </div>
              <div>
                <p><strong>Organizer:</strong> {selectedEvent.organizationname}</p>
                <p><strong>Venue:</strong> {selectedEvent.eventlocation}</p>
                {new Date(selectedEvent.eventstartdate).toDateString() === new Date(selectedEvent.eventenddate).toDateString() ? (
                  <p><strong>Date:</strong>{" "}
                    {new Date(selectedEvent.eventstartdate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                ) : (
                  <p><strong>Date:</strong>{" "}
                    {new Date(selectedEvent.eventstartdate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })} -{" "}
                    {new Date(selectedEvent.eventenddate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-buttons !flex !justify-center !mt-10">
              <Link to={`/events/${selectedEvent.eventslug}`} className="!mt-2 !mb-2">
                <button>View Details</button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;

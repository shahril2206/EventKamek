import React from 'react'
import EventCard from './EventCard'

const EventList = ({events}) => {

  console.log("Events received in EventList:", events);
  return (
    <>
        {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.eventid} event={event} />
            ))
        ) : (
            <p>No events to display.</p>
        )}
    </>
  )
}

export default EventList

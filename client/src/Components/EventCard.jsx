import React from 'react'
import { Link } from 'react-router-dom';

const EventCard = ({event}) => {

    return (
        <Link to={`/Events/${event.eventslug}`} className="event-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="event-card">
                <img src={`${import.meta.env.VITE_API_BASE}/uploads/eventImages/${event.eventimage}`} alt="event image" />
                <div className="event-card-details min-w-0 overflow-hidden">
                    <div className="event-card-details-header">
                        <h2 className="truncate">{event.eventname}</h2>
                        <div className="flex gap-2 min-w-0">
                            <p className="w-1/2 truncate">{event.organizationname}</p>
                            <p className="w-1/2 truncate underline">{event.organizeremail}</p>
                        </div>
                    </div>
                    <div className="event-card-details-body min-w-0">
                        <div className="flex gap-2 min-w-0">
                            <span role="img">📅</span>
                            {new Date(event.eventstartdate).toDateString() === new Date(event.eventenddate).toDateString() ? (
                              <p className="truncate">
                                {new Date(event.eventstartdate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                            ) : (
                              <p className="truncate">
                                {new Date(event.eventstartdate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })} -{" "}
                                {new Date(event.eventenddate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                            )}
                        </div>
                        <div className="flex gap-2 min-w-0">
                            <span role="img">📍</span>
                            <p className="truncate">{event.eventlocation}</p>
                        </div>
                        <p className="line-clamp-2">{event.eventdetails}</p>
                        <p>Status: {event.status}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default EventCard
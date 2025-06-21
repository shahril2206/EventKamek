import React from 'react'
import { Link } from 'react-router-dom';

const EventCard = ({event}) => {

    return (
        <Link to={`/Events/${event.eventslug}`} className="event-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="event-card">
                <img src={`https://eventkamek-production.up.railway.app/uploads/eventImages/${event.eventimage}`} alt="event image" />
                <div className="event-card-details">
                    <div className="event-card-details-header">
                        <h2>{event.eventname}</h2>
                        <p>{event.organizationname}: <span className="underline">{event.organizeremail}</span></p>
                    </div>
                    <div className="event-card-details-body">
                        <div className="flex gap-2">
                            <span role="img">📅</span>
                            {new Date(event.eventstartdate).toDateString() === new Date(event.eventenddate).toDateString() ? (
                              <p>
                                {new Date(event.eventstartdate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                            ) : (
                              <p>
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
                        <div className="flex gap-2">
                            <span role="img">📍</span>
                            <p>{event.eventlocation}</p>
                        </div>
                        <p>{event.eventdetails}</p>
                        <p>Status: {event.status}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default EventCard
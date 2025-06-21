import React, { useState, useEffect } from 'react';
import VendorCard from '../Components/VendorCard';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { Link, useNavigate } from 'react-router-dom';
import useStickyHeaderEffect from '../hooks/useStickyHeaderEffect';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DeleteEvent from '../Components/Modal/DeleteEvent';
import BookingForm from '../Components/Modal/BookingForm';
import { useParams } from 'react-router-dom';
import VendorList from '../Components/VendorList';

const mapContainerStyle = {
  width: '100%',
  height: '200px',
  borderRadius: '12px',
};

const EventDetails = () => {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCkyF0jgc7s-PDTcwbQwxdIbtp0YFwqUOo",
  });

  const { slug } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      const slug = window.location.pathname.split('/').pop();
      try {
        const response = await fetch(`https://eventkamek-production.up.railway.app/api/events/${slug}`);
        const eventData = await response.json();
        console.log('Fetched event data:', eventData);
        setEventData({
          ...eventData,
          eventimage: `https://eventkamek-production.up.railway.app/uploads/eventImages/${eventData.eventimage}`, // dynamically construct the image path
          profilepic: `https://eventkamek-production.up.railway.app/uploads/organizerPFP/${eventData.profilepic}`, // dynamically construct the organizer profile pic path
        });
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, []);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');
  const isTheOrganizer = email === eventData.organizeremail && role === "organizer";

  const mapCenter = {
    lat: parseFloat(eventData.latitude),
    lng: parseFloat(eventData.longitude),
  };

  useStickyHeaderEffect();

  return (
    <main>
      <div id="sentinel" className="h-[1px]"></div>
      <div className="heading-container">
        <h1>
          <Link className="hover:underline" to="/Events">Events</Link> {">"} <span className="underline">{eventData.eventname}</span>
        </h1>
        <div className="heading-btn-section">
          {isTheOrganizer && eventData.status === "Upcoming" && (
            <>
              <Link to={`/EditEvent/${eventData.eventslug}`}>
                <button id="editEvent"><FaEdit />&nbsp;Edit Event</button>
              </Link>
              <button id="deleteEvent" onClick={() => setIsDeleteOpen(true)}>
                <FaTrash />&nbsp;Delete Event
              </button>
            </>
          )}
          {role === "vendor" && (
            <button
              id="bookNow"
              className={`book-now-btn ${eventData.bookedbooths >= eventData.boothslots ? '!bg-gray-400 !cursor-not-allowed !border-[#fefefe] hover:!text-[#fefefe]' : ''}`}
              onClick={() => setIsBookingOpen(true)}
              disabled={eventData.bookedbooths >= eventData.boothslots}
              title={eventData.bookedbooths >= eventData.boothslots ? "All booths have been booked" : "Click to book your booth"}
            >
              {eventData.bookedbooths >= eventData.boothslots ? "Fully Booked" : "Book Now"}
            </button>
          )}
        </div>
      </div>

      <div className="content-container">
        <div className="border-b-1"></div>
        <div className="event-details-container">
          <div className="event-details-left">
            <div>
              <img className="event-details-image" src={eventData.eventimage} alt="eventimage" />
              <div className="event-details-organizer">
                <h2 className="heading">Organizer: </h2>
                <Link to={`/Profile/Organizer/${eventData.organizeremail}`} className="organizer-card hover:shadow-lg transition">
                  <img src={eventData.profilepic} alt="Organizer Profile" /> {/* CHANGE LATER */}
                  <p className="font-semibold text-lg text-[#15104a]">{eventData.organizationname}</p>
                </Link>
              </div>
              <div className="event-description">
                <h2 className="font-bold underline text-[#15104a]">Details:</h2>
                <p className="text-justify">{eventData.eventdetails}</p>
                <br />
                <div className="payment-info-section">
                  <p><strong>Booth Fee:</strong> RM {eventData.boothfee}</p>
                  <p><strong>Refundable Deposit:</strong> RM {eventData.refundabledepo}</p>
                  <p><strong>Non-refundable Deposit:</strong> RM {eventData.nonrefundabledepo}</p>
                  <p><strong>Full Payment:</strong> RM {eventData.fullpayment}</p>
                </div>
                <br />
                Link: <a href={eventData.eventextlink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                  {eventData.eventextlink}
                </a>
              </div>
            </div>
          </div>

          <div className="event-details-right">
            <div className="event-details-venue-date">
              <div className="date">
                <h3>Date:</h3>
                {new Date(eventData.eventstartdate).toDateString() === new Date(eventData.eventenddate).toDateString() ? (
                    <p>
                      {new Date(eventData.eventstartdate).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  ) : (
                    <p>
                      {new Date(eventData.eventstartdate).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} 
                      <strong className="!font-bold"> - </strong> 
                      {new Date(eventData.eventenddate).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  )
                }
              </div>
              <div className="location">
                <h3>Location:</h3>
                <p>{eventData.eventlocation}</p>
                <div className="event-details-map">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={16}
                    >
                      <Marker position={mapCenter} />
                    </GoogleMap>
                  ) : (
                    <p>Loading map...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="event-details-vendor-section">
              <div className="event-details-vendor-heading">
                <h2 className="heading">
                  Assigned Booths (
                  {isTheOrganizer
                    ? `${eventData.assignedbooths} / ${eventData.boothslots}`
                    : eventData.assignedbooths
                  }
                  ):
                </h2>
                {isTheOrganizer && (
                  <Link to={`/BoothsManagement/${eventData.eventslug}`}>
                    <button className="view-all-events">&gt; Manage Booths</button>
                  </Link>
                )}
              </div>
              <div className="vendor-list">
                <VendorList eventId={eventData.eventid} isTheOrganizer={isTheOrganizer} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Now Modal */}
      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedEvent={eventData}
      />

      {/* Delete Event Modal */}
      <DeleteEvent
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        currentEvent={eventData}
      />
    </main>
  );
};

export default EventDetails;

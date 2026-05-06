import React, { useState, useEffect, useCallback } from 'react';
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
  height: '300px',
  borderRadius: '12px',
};

const EventDetails = () => {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [eventImages, setEventImages] = useState([]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
  });

  const { slug } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      const slug = window.location.pathname.split('/').pop();
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/events/${slug}`);
        const eventData = await response.json();
        console.log('Fetched event data:', eventData);
        const base = import.meta.env.VITE_API_BASE;
        // Build ordered list of all available images
        const imgs = ['eventimage', 'eventimage1', 'eventimage2', 'eventimage3', 'eventimage4']
          .map(f => eventData[f])
          .filter(Boolean)
          .map(f => `${base}/uploads/eventImages/${f}`);
        setEventImages(imgs);
        setCarouselIndex(0);

        setEventData({
          ...eventData,
          eventimage: imgs[0] || '',
          profilepic: `${base}/uploads/organizerPFP/${eventData.profilepic}`,
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

  const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % eventImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + eventImages.length) % eventImages.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, eventImages.length]);

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
          <div className="event-details-top">
            {/* Image carousel */}
            {eventImages.length > 0 ? (
              <div className="relative">
                <img
                  className="event-details-image cursor-zoom-in"
                  src={eventImages[carouselIndex]}
                  alt={`Event image ${carouselIndex + 1}`}
                  onClick={() => openLightbox(carouselIndex)}
                />
                {eventImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCarouselIndex(i => (i - 1 + eventImages.length) % eventImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full text-2xl w-10 h-12 flex items-center justify-center hover:bg-black/70 cursor-pointer"
                    >&#8249;</button>
                    <button
                      type="button"
                      onClick={() => setCarouselIndex(i => (i + 1) % eventImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full text-2xl w-10 h-12 flex items-center justify-center hover:bg-black/70 cursor-pointer"
                    >&#8250;</button>
                    <div className="flex justify-center gap-1">
                      {eventImages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2 h-2 rounded-full ${i === carouselIndex ? 'bg-[#15104a]' : 'bg-gray-300'} cursor-pointer position-absolute hover:bg-gray-400`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="event-details-image bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
          </div>
          <hr className="border-gray-500" />

          <div className="event-details-middle">
            <div className="event-details-middle-L">
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

            <div className="event-details-middle-R">
              <div className="event-details-organizer">
                <Link to={`/Profile/Organizer/${eventData.organizeremail}`} className="organizer-card hover:shadow-lg transition">
                  <img src={eventData.profilepic} alt="Organizer Profile" />
                  <p className="font-semibold text-lg text-[#15104a]">{eventData.organizationname}</p>
                </Link>
              </div>
              <div className="event-description">
                <p className="text-justify whitespace-pre-wrap">{eventData.eventdetails}</p>
                <br />
                <table className="payment-info-section">
                  <tbody>
                    <tr className="border-b border-gray-500">
                      <td className="p-3 border-r border-gray-350"><strong>Booth Fee:</strong></td>
                      <td className="p-3">RM {eventData.boothfee}</td>
                    </tr>
                    <tr className="border-b border-gray-500">
                      <td className="p-3 border-r border-gray-350"><strong>Refundable Deposit:</strong></td>
                      <td className="p-3">RM {eventData.refundabledepo}</td>
                    </tr>
                    <tr className="border-b border-gray-500">
                      <td className="p-3 border-r border-gray-350"><strong>Non-refundable Deposit:</strong></td>
                      <td className="p-3">RM {eventData.nonrefundabledepo}</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-gray-350"><strong>Full Payment:</strong></td>
                      <td className="p-3">RM {eventData.fullpayment}</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <a href={eventData.eventextlink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                  {eventData.eventextlink}
                </a>
              </div>
            </div>
          </div>
          <hr className="border-gray-500" />
          <div className="event-details-bottom">
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-5 text-white text-3xl font-bold hover:text-gray-300"
            onClick={closeLightbox}
          >&times;</button>

          {eventImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300"
                onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + eventImages.length) % eventImages.length); }}
              >&#8249;</button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300"
                onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % eventImages.length); }}
              >&#8250;</button>
            </>
          )}

          <img
            src={eventImages[lightboxIndex]}
            alt={`Event image ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
          />

          <div className="absolute bottom-4 flex gap-2">
            {eventImages.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`w-2 h-2 rounded-full ${i === lightboxIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default EventDetails;

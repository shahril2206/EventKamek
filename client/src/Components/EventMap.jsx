import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { getMarkerIcon } from '../utils/getMarkerIcon';
import { Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '15px',
};

const EventMap = ({ events }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${import.meta.env.GOOGLE_MAPS_API}`,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => {
    if (events.length === 1) {
      map.setCenter({
        lat: parseFloat(events[0].latitude),
        lng: parseFloat(events[0].longitude),
      });
      map.setZoom(15); // Set a reasonable zoom level
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      events.forEach(event => {
        bounds.extend({
          lat: parseFloat(event.latitude),
          lng: parseFloat(event.longitude),
        });
      });
      map.fitBounds(bounds);
    }
  }, [events]);


  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  if (!events || events.length === 0) {
    return <p>No events to display.</p>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} onLoad={onLoad}>
      {events.map(event => (
        <Marker
          key={event.eventid}
          position={{ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }}
          onClick={() => {
            setSelectedMarker(null);
            setTimeout(() => setSelectedMarker(event), 0);
          }}
          icon={getMarkerIcon(event.status)}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={{ lat: parseFloat(selectedMarker.latitude), lng: parseFloat(selectedMarker.longitude) }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div
            className={`event-infowindow border-2 p-2 rounded-md ${
              selectedMarker.status.toLowerCase() === 'upcoming'
                ? 'border-green-600'
                : selectedMarker.status.toLowerCase() === 'ongoing'
                ? 'border-yellow-400'
                : 'border-red-500'
            }`}
          >
            <h3 className="text-base font-semibold border-b-1">
              {selectedMarker.eventname} <span className="status">({selectedMarker.status})</span>
            </h3>
            <div className="flex">
              <div className="!mr-3">
                <img src={`${import.meta.env.API_BASE}/uploads/eventImages/${selectedMarker.eventimage}`} alt="event image" className="w-25 rounded-lg" />
              </div>
              <div>
                <p><strong>Organizer:</strong> <span className="organizer-clickable">{selectedMarker.organizationname}</span></p>
                <p><strong>Location:</strong> {selectedMarker.eventlocation}{' '}
                  <span className="text-gray-600 italic underline">
                    x km away
                  </span>
                </p>
                {selectedMarker.eventstartdate === selectedMarker.eventenddate ? (
                  <p><strong>Date:</strong>{" "}
                  {new Date(selectedMarker.eventstartdate).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  
                  </p>
                ) : (
                  <p><strong>Date:</strong>{" "}
                  {new Date(selectedMarker.eventstartdate).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  <strong> - </strong>{" "}
                  {new Date(selectedMarker.eventenddate).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}</p>
                )}
              </div>
            </div>

            <Link to={`/Events/${selectedMarker.eventslug}`} className="view-event-link">
              View Event
            </Link>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default EventMap;

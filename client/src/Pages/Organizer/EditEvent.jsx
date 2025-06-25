import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '230px',
  borderRadius: '12px',
};

const EditEvent = () => {
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
  });

  const { slug } = useParams();
  const [formData, setFormData] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  


  const initialCenter = useRef({ lat: 0, lng: 0 }); // temporary dummy value

  // 🟢 Set the initial markerPosition using the lat/lng from formData
  const [markerPosition, setMarkerPosition] = useState();


  const [map, setMap] = useState(null);

  const geocoder = useRef(null);

  const navigate = useNavigate();

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    geocoder.current = new window.google.maps.Geocoder();
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const reverseGeocodeLatLng = (latLng) => {
    if (!geocoder.current) return;

    geocoder.current.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setFormData((prev) => ({
          ...prev,
          location: results[0].formatted_address,
        }));
      }
    });
  };

  const geocodeAddress = (address) => {
  if (!geocoder.current) return;

    geocoder.current.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const latLng = results[0].geometry.location;
        const coords = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        setMarkerPosition(coords);
      }
    });
  };

  const handleMapClick = (e) => {
    const clickedLatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarkerPosition(clickedLatLng);
    reverseGeocodeLatLng(clickedLatLng);

    // ✅ Pan the map smoothly to the clicked location
    if (map) {
      map.panTo(clickedLatLng);
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/events/${slug}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Fetch failed');

      const toLocalDate = (utcString) => {
        const date = new Date(utcString);
        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - offset * 60000);
        return local.toISOString().split('T')[0];
      };

      setFormData({
        eventName: data.eventname,
        startDate: toLocalDate(data.eventstartdate),
        endDate: toLocalDate(data.eventenddate),
        location: data.eventlocation,
        lat: data.latitude,
        lng: data.longitude,
        image: data.eventimage,
        eventDetails: data.eventdetails,
        eventLink: data.eventextlink,
        includeVendorBooth: data.boothbookingenabled,
        closingBookingDate: data.bookingclosingdate ? toLocalDate(data.bookingclosingdate) : '',
        boothSlots: data.boothslots,
        bookedBooths: data.bookedbooths || 0,
        categoryLimits: {
          Food: data.foodboothlimit,
          Clothing: data.clothingboothlimit,
          Toys: data.toysboothlimit,
          Craft: data.craftboothlimit,
          Books: data.booksboothlimit,
          Accessories: data.accessoriesboothlimit,
          Other: data.otherboothlimit,
        },

        boothFee: data.boothfee,
        refundableDepoAmt: data.refundabledepo,
        nonRefundableDepoAmt: data.nonrefundabledepo,
        fullPayment: data.fullpayment ||
                      (parseFloat(data.boothfee || 0) +
                      parseFloat(data.refundabledepo || 0) +
                      parseFloat(data.nonrefundabledepo || 0)),
      });

      setLocationInput(data.location);
      setMarkerPosition({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
      setPreviewImage(`http://localhost:3000/uploads/eventImages/${data.eventimage}`);
    } catch (error) {
      console.error('Failed to fetch event data:', error.message);
    }
  };

  fetchEventData();

  if (formData?.location) {
    setLocationInput(formData.location);
  }

  if (formData?.lat && formData?.lng) {
    initialCenter.current = {
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
    };
  }

  if (formData?.image) {
    const image =
      typeof formData.image === 'string'
        ? formData.image
        : URL.createObjectURL(formData.image);
    setPreviewImage(image);
  }

    const timeoutId = setTimeout(() => {
      if (locationInput && geocoder.current) {
        geocoder.current.geocode({ address: locationInput }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const latLng = results[0].geometry.location;
            const coords = {
              lat: latLng.lat(),
              lng: latLng.lng(),
            };
            setMarkerPosition(coords);

            // ✅ Ensure map exists and pan to the new position
            if (map) {
              // Slight timeout ensures marker is rendered before pan
              setTimeout(() => map.panTo(coords), 200);
            }
          } else {
            console.warn('Geocoding failed:', status);
          }
        });
      }
    }, 2000); // Delay after user stops typing

    return () => clearTimeout(timeoutId);
  }, [locationInput, map, slug]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'eventImage' && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === 'location') {
      setFormData({ ...formData, location: value });

      // Geocode after user types address
      if (geocoder.current) {
        geocoder.current.geocode({ address: value }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const latLng = results[0].geometry.location;
            const coords = {
              lat: latLng.lat(),
              lng: latLng.lng(),
            };
            setMarkerPosition(coords);

            // ✅ Delay panning slightly to ensure map is updated
            if (map) {
                setTimeout(() => {
                  map.panTo(coords);
                  map.setZoom(16); // Optional: zoom into location
                }, 200);
              }
            } else {
              console.warn('Geocoding failed:', status);
            }
          });
        }
      }

        }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👇 Dynamically calculate fullPayment based on latest inputs
    const fullPayment =
      parseFloat(formData.boothFee || 0) +
      parseFloat(formData.refundableDepoAmt || 0) +
      parseFloat(formData.nonRefundableDepoAmt || 0);

    const normalizeNullable = (val) =>
    val === '' || val === undefined ? null : val;

    const updatedFormData = {
      ...formData,
      boothFee: normalizeNullable(formData.boothFee),
      refundableDepoAmt: normalizeNullable(formData.refundableDepoAmt),
      nonRefundableDepoAmt: normalizeNullable(formData.nonRefundableDepoAmt),
      boothSlots: normalizeNullable(formData.boothSlots),
      closingBookingDate: normalizeNullable(formData.closingBookingDate),
      fullPayment: parseFloat(formData.boothFee || 0) +
                  parseFloat(formData.refundableDepoAmt || 0) +
                  parseFloat(formData.nonRefundableDepoAmt || 0),
      categoryLimits: Object.fromEntries(
        Object.entries(formData.categoryLimits).map(([k, v]) => [k, normalizeNullable(v)])
      ),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/events/update/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Event updated successfully!');
        navigate(`/Events/${slug}`);
      } else {
        alert('❌ Update failed: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error updating event:', error);
      alert('❌ An error occurred while updating the event.');
    }
  };

  return (
    <main className="!mt-0">
      <div className="edit-event-form-container">
        <h1><FaEdit/>&nbsp;Edit Event</h1>

        {formData ? (
        <form className="edit-event-form" onSubmit={handleSubmit}>
          <div className="event-info-div">
            <h2>Event Info</h2>
            <label>Event Name <span className="required">*</span>:</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
            />

            <label>Event Date <span className="required">*</span>:</label>
            <div className="event-datetime">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={getTomorrowDate()}
                max={formData.endDate}
                required
              />
              <p>&nbsp;-&nbsp;</p>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || getTomorrowDate()} // 👈 min = startDate
                disabled={!formData.startDate} // 👈 disable until startDate is selected
                required
              />
            </div>

            <label>Event Venue <span className="required">*</span>:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            {isLoaded && (
              <div className="form-map-container">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={initialCenter.current}
                  zoom={15}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={handleMapClick}
                >
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              </div>
            )}


            <p className="!mb-4">
              Lat: {markerPosition ? markerPosition.lat.toFixed(5) : '-'}; 
              Lng: {markerPosition ? markerPosition.lng.toFixed(5) : '-'}
            </p>
            <label>Event Image:</label>
            {!previewImage ? (
              <input
                type="file"
                accept="image/*"
                name="eventImage"
                onChange={handleChange}
              />
            ) : (
              <div className="image-preview-wrapper" style={{ position: 'relative' }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData({ ...formData, image: null });
                  }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}

            <label>Event Details:</label>
            <textarea
              name="eventDetails"
              rows="3"
              value={formData.eventDetails}
              onChange={handleChange}
            />

            <label>Event Link:</label>
            <input
              type="text"
              name="eventLink"
              value={formData.eventLink}
              onChange={handleChange}
            />

          </div>

          <div className="booking-purposes-info-div">
            <h2>Info for Booking Purposes</h2>
            <div className="flex items-center !mb-2">
              <label htmlFor="includeVendorBooth" className="ml-2 !text-sm border-b-2 border-gray-300 cursor-pointer">
                Enable Vendor Booth Booking for this event
              </label>
              <input
                type="checkbox"
                id="includeVendorBooth"
                name="includeVendorBooth"
                checked={formData.includeVendorBooth || false}
                disabled={formData.bookedBooths > 0} // 👈 disable if booths are already booked
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    includeVendorBooth: e.target.checked
                  }))
                }
              />
            </div>
            <label>Booking Form Closing Date {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="date"
              name="closingBookingDate"
              value={formData.closingBookingDate}
              onChange={handleChange}
              min={getTomorrowDate()} // 👈 min = startDate
              max={formData.startDate}
              disabled={!formData.includeVendorBooth || !formData.startDate} // 👈 disable until startDate is selected
              required
            />
            <label>Booth Slots <span className="text-gray-500 italic text-sm font-normal">(Booked Booths: {formData.bookedBooths})</span> {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="number"
              name="boothSlots"
              value={formData.boothSlots}
              min = {formData.bookedBooths}
              placeholder={`can be less than booked booths (${formData.bookedBooths})`}
              onChange={e => {
              handleChange(e);
              const value = e.target.value;

              setFormData(prev => {
                const boothSlotsNum = parseInt(value, 10) || 0;

                // Leave categoryLimits untouched if boothSlots is cleared
                if (!value) {
                  return {
                    ...prev,
                    boothSlots: value,
                    categoryLimits: {
                      Food: "",
                      Clothing: "",
                      Toys: "",
                      Craft: "",
                      Books: "",
                      Accessories: "",
                      Other: "",
                    }
                  };
                }

                // Clamp only existing numeric values
                const newCategoryLimits = {};
                ["Food", "Clothing", "Toys", "Craft", "Books", "Accessories", "Other"].forEach(cat => {
                  const prevVal = prev.categoryLimits?.[cat];
                  if (prevVal !== "" && !isNaN(prevVal)) {
                    const valNum = parseInt(prevVal, 10);
                    newCategoryLimits[cat] = Math.min(valNum, boothSlotsNum);
                  } else {
                    newCategoryLimits[cat] = prevVal; // preserve empty value
                  }
                });

                return {
                  ...prev,
                  boothSlots: value,
                  categoryLimits: newCategoryLimits,
                };
              });
            }}

              required
              disabled={!formData.includeVendorBooth}
            />
            <label className="!mb-1">Booth Category Limit <span className="!text-sm !text-gray-400 italic underline">(Enter 0 if not allowed. Left blank if has no limit)</span>:</label>
            <div className="limit-each-cat">
              {["Food", "Clothing", "Toys", "Craft", "Books", "Accessories", "Other"].map(cat => (
                <div className="flex flex-col justify-center !mr-5" key={cat}>
                  <span>{cat}:</span>
                  <input
                    type="number"
                    min="0"
                    max={formData.boothSlots ? formData.boothSlots : undefined}
                    name={`categoryLimits.${cat}`}
                    value={
                      formData.categoryLimits && formData.categoryLimits[cat] !== undefined
                        ? formData.categoryLimits[cat]
                        : ""
                    }
                    disabled={!formData.includeVendorBooth || !formData.boothSlots}
                    onChange={e => {
                      let value = e.target.value;
                      // Clamp value to boothSlots
                      if (formData.boothSlots) {
                        const max = parseInt(formData.boothSlots, 10) || 0;
                        if (parseInt(value, 10) > max) {
                          value = max;
                        }
                      }
                      setFormData(prev => ({
                        ...prev,
                        categoryLimits: {
                          ...(prev.categoryLimits || {}),
                          [cat]: value
                        }
                      }));
                    }}
                  />
                </div>
              ))}
            </div>

            <label>Booth Fee {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="number"
              name="boothFee"
              value={formData.boothFee ?? ''}
              min="0"
              onChange={handleChange}
              required
              disabled={!formData.includeVendorBooth}
            />

            <label>Refundable Deposit {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="number"
              name="refundableDepoAmt"
              value={formData.refundableDepoAmt ?? ''}
              min="0"
              onChange={handleChange}
              required
              disabled={!formData.includeVendorBooth}
            />

            <label>Non-refundable Deposit {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="number"
              name="nonRefundableDepoAmt"
              value={formData.nonRefundableDepoAmt ?? ''}
              min="0"
              onChange={handleChange}
              required
              disabled={!formData.includeVendorBooth}
            />

            <label>Full Payment:</label>
            <input
              type="number"
              name="fullPayment"
              value={
                      (parseFloat(formData.boothFee || 0) +
                      parseFloat(formData.refundableDepoAmt || 0) +
                      parseFloat(formData.nonRefundableDepoAmt || 0)).toString() ||
                      formData.fullPayment || ''
                    }

              readOnly
              disabled={!formData.includeVendorBooth}
            />
          </div>

          <div className="buttons-container">
            <button type="submit" name="createEventBtn" className="create-event-btn">Save</button>
            <button
              type="button"
              className="cancel-form"
              onClick={() => window.history.back()}
            >
              Cancel and Go Back
            </button>
          </div>
        </form>
        ) : (
          <p>Loading event data...</p>
        )}
      </div>
    </main>
  );
};

export default EditEvent;
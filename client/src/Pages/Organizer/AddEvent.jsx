import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '230px',
  borderRadius: '12px',
};

const mapCenter = {
  lat: 1.5535, 
  lng: 110.3593,
};

const AddEvent = () => {
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  };
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
  });

  const [map, setMap] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const geocoder = useRef(null);
  const navigate = useNavigate();

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    geocoder.current = new window.google.maps.Geocoder();
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  

  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    endDate: '',
    location: '',
    image: null,
    eventDetails: '',
    eventLink: '',
    includeVendorBooth: false,
    bookingClosingDate: '',
    boothSlots: 0,
    categoryLimits: {
      Food: 0,
      Clothing: 0,
      Toys: 0,
      Craft: 0,
      Books: 0,
      Accessories: 0,
      Other: 0,
    },
    boothFee: 0.00,
    refundableDepoAmt: 0.00,
    nonRefundableDepoAmt: 0.00,
    fullPayment: 0.00,
  });

  const [previewImage, setPreviewImage] = useState(null);

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
  }, [locationInput, map]);

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

    const cleanValue = (val) => {
      if (val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };
    const fullPaymentValue = 
    parseFloat(formData.boothFee || 0) +
    parseFloat(formData.refundableDepoAmt || 0) +
    parseFloat(formData.nonRefundableDepoAmt || 0);

    const payload = {
      ...formData,
      bookingClosingDate: formData.bookingClosingDate || null,
      boothSlots: formData.boothSlots === 0 || formData.boothSlots === "" ? null : cleanValue(formData.boothSlots),
      boothFee: cleanValue(formData.boothFee),
      refundableDepoAmt: cleanValue(formData.refundableDepoAmt),
      nonRefundableDepoAmt: cleanValue(formData.nonRefundableDepoAmt),
      fullPayment: fullPaymentValue,
      categoryLimits: {
        Food: cleanValue(formData.categoryLimits?.Food),
        Clothing: cleanValue(formData.categoryLimits?.Clothing),
        Toys: cleanValue(formData.categoryLimits?.Toys),
        Craft: cleanValue(formData.categoryLimits?.Craft),
        Books: cleanValue(formData.categoryLimits?.Books),
        Accessories: cleanValue(formData.categoryLimits?.Accessories),
        Other: cleanValue(formData.categoryLimits?.Other),
      },
      lat: markerPosition?.lat || null,
      lng: markerPosition?.lng || null,
      organizeremail: localStorage.getItem('email'),
      status: 'Upcoming',
      image: 'dummy.jpg',
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Event created successfully!');
        navigate('/');
      } else {
        alert('❌ Failed to create event');
      }
    } catch (err) {
      console.error('Submit Error:', err);
      alert('⚠️ Error creating event');
    }
  };


  return (
    <main className="!mt-0">
      <div className="add-event-form-container">
        <h1><FaPlus className="text-xl"/>&nbsp;Add Event</h1>

        <form className="add-event-form" onSubmit={handleSubmit}>
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
                value={formData.startDateTime}
                onChange={handleChange}
                min={getTomorrowDate()}
                max={formData.endDate}
                required
              />
              <p>&nbsp;-&nbsp;</p>
              <input
                type="date"
                name="endDate"
                value={formData.endDateTime}
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
                  center={mapCenter}
                  zoom={14}
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
              placeholder="enter event details (about, time, etc.)"
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
              name="bookingClosingDate"
              value={formData.bookingClosingDate || ""}
              onChange={handleChange}
              min={getTomorrowDate()}
              max={formData.startDate}
              disabled={!formData.includeVendorBooth || !formData.startDate}
              required
            />

            <label>Booth Slots {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="number"
              name="boothSlots"
              value={formData.boothSlots}
              min="1"
              onChange={e => {
                handleChange(e);
                const value = e.target.value;
                setFormData(prev => {
                  const boothSlotsNum = parseInt(value, 10) || 0;
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
                  const newCategoryLimits = {};
                  ["Food", "Clothing", "Toys", "Craft", "Books", "Accessories", "Other"].forEach(cat => {
                    const prevVal = prev.categoryLimits && prev.categoryLimits[cat];
                    let newVal = prevVal === "" || prevVal === undefined ? "" : prevVal;
                    if (newVal !== "") {
                      newVal = Math.min(parseInt(newVal, 10) || 0, boothSlotsNum);
                    }
                    newCategoryLimits[cat] = newVal;
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
              value={formData.boothFee || ""}
              min="0"
              onChange={handleChange}
              required
              disabled={!formData.includeVendorBooth}
            />

            <label>Refundable Deposit {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="number"
              name="refundableDepoAmt"
              value={formData.refundableDepoAmt || ""}
              min="0"
              onChange={handleChange}
              required
              disabled={!formData.includeVendorBooth}
            />

            <label>Non-refundable Deposit {formData.includeVendorBooth && <span className="required">*</span>}:</label>
            <input
              type="number"
              name="nonRefundableDepoAmt"
              value={formData.nonRefundableDepoAmt || ""}
              min="0"
              onChange={handleChange}
              required
              disabled={!formData.includeVendorBooth}
            />

            <label>Full Payment:</label>
            <input
              type="number"
              name="fullPayment"
              value={formData.fullPayment ||
                (parseFloat(formData.boothFee || 0) +
                  parseFloat(formData.refundableDepoAmt || 0) +
                  parseFloat(formData.nonRefundableDepoAmt || 0)).toString()
              }
              readOnly
              disabled={!formData.includeVendorBooth}
            />

          </div>


          <div className="buttons-container">
            <button type="submit" name="createEventBtn" className="create-event-btn">Create</button>
            <button
              type="button"
              className="cancel-form"
              onClick={() => window.history.back()}
            >
              Cancel and Go Back
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddEvent;
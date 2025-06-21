import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AddAssignment = ({
  isOpen,
  onClose,
  selectedEvent,
  selectedBooking,
}) => {
  const [selectedBooth, setSelectedBooth] = useState('');
  const [booths, setBooths] = useState([]);

  useEffect(() => {
    const fetchAvailableBooths = async () => {
      if (selectedEvent?.eventid) {
        console.log('Fetching booths for event ID:', selectedEvent.eventid); // ✅ add this
        try {
          const res = await fetch(`http://localhost:3000/api/unassigned-booths/${selectedEvent.eventid}`);
          const data = await res.json();
          setBooths(data.booths || []);
        } catch (err) {
          console.error('Error fetching booths:', err);
          setBooths([]);
        }
      }
    };

    setSelectedBooth('');
    fetchAvailableBooths();
  }, [selectedEvent, selectedBooking, isOpen]);


  if (!isOpen || !selectedEvent || !selectedBooking) return null;

  const {
    eventname,
    eventstartdate,
    eventenddate,
    eventlocation,
    status: eventStatus,
  } = selectedEvent;

  const {
    bookingid,
    vendorname,
    vendoremail,
    boothname,
    boothcategory,
    bookingdatetime,
    remark,
  } = selectedBooking;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBooth) {
      alert('Please select a booth.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/addassignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingid: bookingid,
          eventid: selectedEvent.eventid,
          boothno: selectedBooth,
          vendoremail: selectedBooking.vendoremail,
          boothname: selectedBooking.boothname,
          boothcategory: selectedBooking.boothcategory,
          remark: selectedBooking.remark
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Assignment failed');
      }

      alert('✅ Vendor successfully assigned!');
      window.location.reload();
      onClose();
    } catch (err) {
      console.error('Assignment error:', err);
      alert(`❌ Failed to assign vendor: ${err.message}`);
    }
  };


  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="booking-response-modal">
        <div className="booking-response-form-heading">
          <h2>Assign Vendor</h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Event Info</h3>
          <div className="info-section">
            <p><strong>Event:</strong> {eventname}</p>
            <p>
              <strong>Date:</strong>{' '}
              {eventstartdate === eventenddate
                ? `${eventstartdate} (${eventStatus})`
                : `${eventstartdate} - ${eventenddate} (${eventStatus})`}
            </p>
            <p><strong>Venue:</strong> {eventlocation}</p>
          </div>

          <h3>Booking Info</h3>
          <div className="info-section">
            <p><strong>Booking Ref. No.:</strong> {bookingid}</p>
            <p><strong>Vendor Name:</strong> {vendorname} <Link className="text-blue-800 italic underline text-sm" to={`/Profile/Vendor/${vendoremail}`}> ({vendoremail}) </Link></p>
            <p><strong>Booking Date & Time:</strong> {bookingdatetime}</p>
            <p><strong>Vendor Booth Name:</strong> {boothname}</p>
            <p><strong>Vendor Booth Category:</strong> {boothcategory}</p>
            <p><strong>Remark:</strong> {remark || '-'}</p>

            <label htmlFor="booth">
              <strong>Assign Booth <span className="text-red-600">*</span>:</strong>
            </label>
            <select
              id="booth"
              value={selectedBooth}
              onChange={(e) => setSelectedBooth(e.target.value)}
            >
              <option value="" disabled>Select a booth</option>
              {booths.map((boothno, idx) => (
                <option key={idx} value={boothno}>{boothno}</option>
              ))}
            </select>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="approve-btn">Confirm Assignment</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAssignment;

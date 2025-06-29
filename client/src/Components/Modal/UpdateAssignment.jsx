import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UpdateAssignment = ({
  isOpen,
  onClose,
  selectedEvent,
  selectedAssignment,
}) => {
  const [selectedBooth, setSelectedBooth] = useState('');
  const [remarkInput, setRemarkInput] = useState('');
  const [boothOptions, setBoothOptions] = useState([]);


  useEffect(() => {
    if (selectedAssignment && selectedEvent?.eventid) {
      setSelectedBooth(selectedAssignment?.boothno || '');
      setRemarkInput(selectedAssignment?.remark || '');

      const fetchAvailableBooths = async () => {
        try {
          const res = await fetch(`${import.meta.env.API_BASE}/api/unassigned-booths/${selectedEvent.eventid}`);
          const data = await res.json();

          // Always include the currently selected boothno in the list
          let booths = data.booths || [];

          if (
            selectedAssignment?.boothno &&
            !booths.includes(selectedAssignment.boothno)
          ) {
            booths = [selectedAssignment.boothno, ...booths];
          }

          setBoothOptions(booths);
        } catch (err) {
          console.error('Error fetching booth options:', err);
          setBoothOptions([]);
        }
      };

      fetchAvailableBooths();
    }
  }, [selectedAssignment, selectedEvent, isOpen]);


  if (!isOpen || !selectedEvent || !selectedAssignment) return null;

  const {
    eventname,
    eventstartdate,
    eventenddate,
    status: eventStatus,
    eventlocation: venue,
    booths,
  } = selectedEvent;


  const {
    vendorname,
    vendoremail,
    boothname,
    boothcategory,
    boothno = selectedBooth,
  } = selectedAssignment;

  const isEditable = eventStatus === 'Upcoming';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBooth) {
      alert('Please select a booth.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.API_BASE}/api/updateassignment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentid: selectedAssignment.assignmentid,
          eventid: selectedEvent.eventid,
          boothno: selectedBooth,
          remark: remarkInput
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Update failed');
      }

      alert('✅ Assignment updated successfully!');
      window.location.reload();
      onClose();
    } catch (err) {
      console.error('Assignment update error:', err);
      alert(`❌ Failed to update assignment: ${err.message}`);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="assignment-modal">
        <div className="assignment-form-heading">
          {eventStatus === "Upcoming" ? (
            <h2>View/Update Assignment</h2>
            ) : eventStatus === "Ongoing" ? (
              <h2>View Assignment</h2>
            ) : null
          }
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
            {eventstartdate === eventenddate ? (
              <p><strong>Date:</strong> {eventstartdate} ({eventStatus})</p>
            ) : (
              <p><strong>Date:</strong> {eventstartdate} - {eventenddate} ({eventStatus})</p>
            )}
            <p><strong>Venue:</strong> {venue}</p>
          </div>

          <h3>Assignment Info</h3>
          <div className="info-section">
            <p><strong>Vendor Name:</strong> {vendorname} <Link className="text-blue-800 italic underline text-sm" to={`/Profile/Vendor/${vendoremail}`}> ({vendoremail}) </Link></p>
            <p><strong>Booth Name:</strong> {boothname}</p>
            <p><strong>Booth Category:</strong> {boothcategory}</p>

            {isEditable ? (
              <>
                <label htmlFor="booth"><strong>Booth:</strong></label>
                <select
                  id="booth"
                  value={selectedBooth}
                  onChange={(e) => setSelectedBooth(e.target.value)}
                  disabled={!isEditable}
                >
                  <option value="" disabled selected>Select a booth</option>
                  {boothOptions.map((boothno, idx) => (
                    <option key={idx} value={boothno}>
                      {boothno === selectedAssignment.boothno ? `${boothno} (currently assigned)` : boothno}
                    </option>
                  ))}
                </select>
                <br />

                <label htmlFor="remark"><strong>Remark:</strong></label>
                <textarea
                  id="remark"
                  value={remarkInput}
                  rows={4}
                  disabled={!isEditable}
                  onChange={(e) => setRemarkInput(e.target.value)}
                />
              </>
            ) : (
              <>
                <p><strong>Booth:</strong> {boothno}</p>
                <p><strong>Remark:</strong> {remarkInput}</p>
              </>
            )}

          </div>

          <div className="modal-buttons">
            {isEditable ? (
              <>
                <button type="submit" className="approve-btn">
                  Update this assignment
                </button>
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
              </>
            ): (
              <button type="button" onClick={onClose} className="cancel-btn">
                Close
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateAssignment;

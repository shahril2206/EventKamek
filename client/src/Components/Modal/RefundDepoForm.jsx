import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RefundDepoForm = ({
  isOpen,
  onClose,
  selectedEvent,
  selectedAssignment,
}) => {
  const [depositAction, setDepositAction] = useState('');
  const [forfeitDetails, setForfeitDetails] = useState('');

  if (!isOpen || !selectedEvent || !selectedAssignment) return null;

  const {
    eventname,
    eventstartdate,
    eventenddate,
    status,
    eventlocation
  } = selectedEvent;

  const {
    vendorname,
    vendoremail,
    boothname,
    boothcategory,
    boothno,
    remark,
    refundabledepostatus,
    refundabledepo,
    assignmentid,
    forfeituredetails: toDisplayForfeitDetails,
  } = selectedAssignment;

  const navigate = useNavigate();

  const handleProceed = async (e) => {
    e.preventDefault();

    const refundInfo = {
      assignmentid,
      eventname: selectedEvent.eventName || eventname,
      vendorname,
      boothname,
      boothcategory,
      boothno,
      refundabledepo: refundabledepo || 0,
      forfeitDetails,
    };

    if (depositAction === "Refund") {
      navigate('/RefundDeposit', { state: refundInfo });
    } else if (depositAction === "Forfeit") {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/forfeitdeposit/${assignmentid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refundabledepo,
            forfeituredetails: forfeitDetails,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("✅ Deposit marked as forfeited.");
          window.location.reload();
          onClose();
        } else {
          alert("❌ Failed to forfeit deposit: " + data.error);
        }
      } catch (err)  {
        console.error('Forfeit error:', err);
        alert("❌ Network error during forfeiture.");
      }
    }
  };


  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="assignment-modal">
        <div className="assignment-form-heading">
          <h2>Refund/Forfeit Assignment</h2>
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleProceed}>
          <h3>Event Info</h3>
          <div className="info-section">
            <p><strong>Event:</strong> {eventname}</p>
            {eventstartdate === eventenddate ? (
              <p><strong>Date:</strong> {eventstartdate} ({status})</p>
            ) : (
              <p><strong>Date:</strong> {eventstartdate} - {eventenddate} ({status})</p>
            )}
            <p><strong>Venue:</strong> {eventlocation}</p>
          </div>

          <h3>Assignment Info</h3>
          <div className="info-section">
            <p><strong>Vendor Name:</strong> {vendorname} <Link className="text-blue-800 italic underline text-sm" to={`/Profile/Vendor/${vendoremail}`}> ({vendoremail}) </Link></p>
            <p><strong>Booth Name:</strong> {boothname}</p>
            <p><strong>Booth Category:</strong> {boothcategory}</p>
            <p><strong>Booth:</strong> {boothno}</p>
            <p><strong>Remark:</strong> {remark}</p>

            <p>
              <strong>Refundable Deposit:</strong>{" "}
              <span className={
                refundabledepostatus === "Forfeited" ? "text-red-600" :
                refundabledepostatus === "Refunded" ? "text-green-600" : ""
              }>
                RM {refundabledepo ?? "-"} 
              </span>{" "}
              {refundabledepostatus && (
                <>
                  <span className={
                    refundabledepostatus === "Forfeited" ? "text-red-600" :
                    refundabledepostatus === "Refunded" ? "text-green-600" : ""
                  }>
                    ({refundabledepostatus})
                  </span>

                  {refundabledepostatus === "Forfeited" && (
                    <p><strong>Forfeiture Details:</strong> {toDisplayForfeitDetails}</p>
                  )}
                </>
              )}
            </p>

            {/* Show action only if status is null or not set */}
            {!refundabledepostatus && (
              <>
                <label htmlFor="depositAction"><strong>Action:</strong></label>
                <select
                  id="depositAction"
                  value={depositAction}
                  onChange={(e) => setDepositAction(e.target.value)}
                >
                  <option value="" disabled>Select Refund or Forfeit</option>
                  <option value="Refund">Refund</option>
                  <option value="Forfeit">Forfeit</option>
                </select>

                {depositAction === "Forfeit" && (
                  <>
                    <label htmlFor="forfeitDetails"><strong>Forfeiture Details:</strong></label>
                    <textarea
                      id="forfeitDetails"
                      placeholder="Enter the reason for forfeiture"
                      rows={3}
                      name="forfeitDetails"
                      value={forfeitDetails}
                      onChange={(e) => setForfeitDetails(e.target.value)}
                    />
                  </>
                )}
              </>
            )}
          </div>

          <div className="modal-buttons">
            {depositAction === "Forfeit" ? (
              <button type="submit" className="approve-btn !bg-red-800 !border-red-800 hover:!bg-transparent hover:!text-red-700">
                Forfeit Deposit
              </button>
            ) : depositAction === "Refund" ? (
              <button type="submit" className="approve-btn">
                Proceed to Refund
              </button>
            ) : null}

            <button type="button" onClick={onClose} className="cancel-btn">
              {refundabledepostatus ? "Close" : "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RefundDepoForm;

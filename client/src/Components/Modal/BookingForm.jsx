import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ isOpen, onClose, selectedEvent }) => {
  const [remark, setRemark] = useState('');
  const [boothName, setBoothName] = useState('');
  const [boothCategory, setBoothCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setRemark('');
    setBoothName('');
    setBoothCategory('');
  }, [selectedEvent, isOpen]);

  if (!isOpen || !selectedEvent) return null;

  const {
    eventname = '',
    eventstartdate = '',
    eventenddate = '',
    organizationname = '',
    organizeremail = '',
    contactnum = '',
    refundabledepo = 0,
    nonrefundabledepo = 0,
    boothfee = 0,
    fullpayment = 0,
    boothslots = 0,
    bookedbooths = 0,
    eventid = '',
    eventslug = '',
  } = selectedEvent;

  const availableBooths = boothslots - bookedbooths;

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingInfo = {
      eventId: eventid,
      eventName: eventname,
      eventStartDate: eventstartdate,
      eventEndDate: eventenddate,
      organizerName: organizationname,
      organizerEmail: organizeremail,
      contact: contactnum,
      boothslots: boothslots,
      bookedBooths: bookedbooths,
      refundableDepoAmt: refundabledepo,
      nonRefundableDepoAmt: nonrefundabledepo,
      boothFee: boothfee,
      fullPayment: fullpayment,
      eventslug: eventslug,
      boothName,
      boothCategory,
      remark,
    };

    navigate('/PaymentBooking', { state: bookingInfo });
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="booking-modal">
        <div className="booking-form-heading">
          <h2>Booking</h2>
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
          <div className="booking-info">
            <p><strong>Event:</strong> {eventname}</p>
            <p><strong>Organized by:</strong> {organizationname}</p>
            <p><strong>Booths availability:</strong> {availableBooths}</p>
          </div>

          <div className="form-group">
            <label htmlFor="boothName">Your Booth Name <span className="text-red-700">*</span>:</label>
            <input
              type="text"
              id="boothName"
              name="boothName"
              value={boothName}
              onChange={(e) => setBoothName(e.target.value)}
              required
            />

            <label htmlFor="boothCategory">Booth Category <span className="text-red-700">*</span>:</label>
            <select
              id="boothCategory"
              name="boothCategory"
              value={boothCategory}
              onChange={(e) => setBoothCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {['Food', 'Clothing', 'Toys', 'Craft', 'Books', 'Accessories', 'Other'].map(cat => {
                const currentCount = selectedEvent.categoryBookingCounts?.[cat] || 0;
                const limit = selectedEvent[`${cat.toLowerCase()}boothlimit`] ?? null; // read from eventData

                const isFull = limit !== null && currentCount >= limit;

                return (
                  <option key={cat} value={cat} disabled={isFull}>
                    {cat}{isFull ? ' (Full)' : ''}
                  </option>
                );
              })}
            </select>


            <label htmlFor="remark">Remark <span className="text-gray-500 ml-2">(optional)</span>:</label>
            <textarea
              id="remark"
              name="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows="4"
              placeholder="Any specific request or comment?"
            />
          </div>

          <div className="contact-info">
            <p>
              <strong>Contact us for more information</strong><br />
              Email: {organizeremail} <br />
              Contact: {contactnum}
            </p>
          </div>

          <div className="modal-buttons">
            <button type="submit">Proceed to payment</button>
            <button type="button" className="cancel-form" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BookingForm;

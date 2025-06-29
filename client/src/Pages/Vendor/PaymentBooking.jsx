import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-4">
        <p>Error: No booking data provided.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Get vendor email from localStorage (assuming it's stored after login)
  const emailBooking = localStorage.getItem('email');

  const {
    eventId,
    boothName,
    boothCategory,
    remark,
    eventName,
    refundableDepoAmt,
    nonRefundableDepoAmt,
    boothFee,
    fullPayment,
    eventslug
  } = state;

  // Overwrite vendoremail with the currently signed-in vendor's email
  const vendoremail = emailBooking;


  const handleDummyPayment = async (e) => {
    e.preventDefault();

    const bookingData = {
      ...state,
      vendoremail,
      eventId,
      eventslug,
    };

    console.log("➡️ Booking Data Sent:", bookingData);

    try {
      const response = await fetch(`${import.meta.env.API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Response Error:', errorData);
        throw new Error(errorData.error || 'Unknown error');
      }

      alert('✅ Payment and Booking Successful');
      navigate(`/Events/${eventslug}`); // Navigate to the current event slug
    } catch (error) {
      console.error('Booking Error:', error);
      alert(`❌ Failed to book booth: ${error.message}`);
    }
  };



  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-1 max-w-xl mx-auto p-6 bg-white shadow-md rounded-md !p-5">
      <h2 className="text-2xl font-bold mb-4">Payment Page</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Booking Summary</h3>
        <p><strong>Event:</strong> {eventName}</p>
        <p><strong>Booth Name:</strong> {boothName}</p>
        <p><strong>Category:</strong> {boothCategory}</p>
        {remark && <p><strong>Remark:</strong> {remark}</p>}
        <p><strong>Refundable Deposit Amount:</strong> RM {refundableDepoAmt}</p>
        <p><strong>Non-refundable Deposit Amount:</strong> RM {nonRefundableDepoAmt}</p>
        <p className="!pb-1"><strong>Booth Fee:</strong> RM {boothFee}</p>
        <p className="border-t-1 border-gray-700 !pt-1"><strong>Full Payment: RM {fullPayment} </strong></p>
      </div>

      <form onSubmit={handleDummyPayment} className="space-y-4 !mt-4">
        <div>
          <label className="block font-medium">Name on Card</label>
          <input type="text" required className="border border-gray-300 p-2 w-full rounded" />
        </div>

        <div>
          <label className="block font-medium">Card Number</label>
          <input type="text" required maxLength="16" className="border border-gray-300 p-2 w-full rounded" />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-medium">Expiry Date</label>
            <input type="text" required placeholder="MM/YY" className="border border-gray-300 p-2 w-full rounded" />
          </div>

          <div className="w-1/2">
            <label className="block font-medium">CVV</label>
            <input type="password" required maxLength="3" className="border border-gray-300 p-2 w-full rounded" />
          </div>
        </div>

        <div>
          <label className="block font-medium">Amount (RM)</label>
          <input type="number" value={fullPayment} readOnly className="border-1 border-gray-300 p-2 w-full rounded" />
        </div>

        <button type="submit" className="bg-[#15104a] cursor-pointer text-base text-white !mt-6 !py-1 px-4 rounded hover:bg-gray-300 hover:text-black w-full transition duration 300 ease-in-out">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentBooking;

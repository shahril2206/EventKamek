import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RefundCancelledBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-4">
        <p>Error: No assignment data provided.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const {
    assignmentid,
    eventname,
    vendorname,
    boothname,
    boothcategory,
    boothno,
    cancellationremark,
    eventslug
  } = state;

  console.log('assignment id state:', state.assignmentid);

  const handleRefundSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`https://eventkamek-production.up.railway.app/api/removeassignment/${assignmentid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancellationremark }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Refund Successful');
      navigate(-1);
    } else {
      alert('❌ Error: ' + data.error);
    }
  };



  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-1 max-w-xl mx-auto p-6 bg-white shadow-md rounded-md !p-5">
      <h2 className="text-2xl font-bold mb-4">Remove Assignment and Refund</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Assignment Summary</h3>
        <p><strong>Event:</strong> {eventname}</p>
        <p><strong>Vendor:</strong> {vendorname}</p>
        <p><strong>Booth No.:</strong> {boothno}</p>
        <p><strong>Booth Name:</strong> {boothname}</p>
        <p><strong>Category:</strong> {boothcategory}</p>
        <p><strong>Cancellation Remark:</strong> {cancellationremark}</p>
      </div>

      <form onSubmit={handleRefundSubmit} className="space-y-4 !mt-4">
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
          <input type="number" name="cancelledRefundAmt" className="border-1 border-gray-300 p-2 w-full rounded" />
        </div>

        <button type="submit" className="bg-[#15104a] cursor-pointer text-base text-white !mt-6 !py-1 px-4 rounded hover:bg-gray-300 hover:text-black w-full transition duration 300 ease-in-out">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default RefundCancelledBooking;
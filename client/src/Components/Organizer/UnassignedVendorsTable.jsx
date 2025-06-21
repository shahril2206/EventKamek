import React, { useState } from 'react';
import AddAssignment from '../Modal/AddAssignment';

const UnassignedVendorsTable = ({ eventData, bookings, keyword }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const lowerKeyword = keyword?.toLowerCase() || '';

  const filteredBookings = bookings.filter(b =>
    b.bookingid?.toString().includes(lowerKeyword) ||
    b.vendorname?.toLowerCase().includes(lowerKeyword) ||
    b.vendoremail?.toLowerCase().includes(lowerKeyword) ||
    b.boothname?.toLowerCase().includes(lowerKeyword) ||
    b.boothcategory?.toLowerCase().includes(lowerKeyword) ||
    b.remark?.toLowerCase().includes(lowerKeyword)
  );

  const handleViewUpdate = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <>
      {filteredBookings.length > 0 ? (
        <>
          <br />
          <p>The following table shows bookings made by vendors</p>
          <table className="booth-table">
            <thead>
              <tr>
                <th>Booking Ref. No.</th>
                <th>Booking Date & Time</th>
                <th>Vendor Name</th>
                <th>Booth Name</th>
                <th>Booth Category</th>
                <th>Remark</th>
                {eventData?.status === "Upcoming" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i}>
                  <td>{b.bookingid}</td>
                  <td>{b.bookingdatetime || '-'}</td>
                  <td>{b.vendorname || '-'}</td>
                  <td>{b.boothname || '-'}</td>
                  <td>{b.boothcategory || '-'}</td>
                  <td>{b.remark || '-'}</td>
                  {eventData?.status === "Upcoming" && (
                    <td>
                      <button className="booth-assign-btn" onClick={() => handleViewUpdate(b)}>
                        Assign Booth
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && selectedBooking && (
            <AddAssignment
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              selectedEvent={eventData}
              selectedBooking={selectedBooking}
            />
          )}
        </>
      ) : (
        <>
          <br />
          <p>No unassigned vendors match your filters.</p>
        </>
      )}
    </>
  );
};

export default UnassignedVendorsTable;

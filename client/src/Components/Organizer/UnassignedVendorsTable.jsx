import React, { useState } from 'react';
import AddAssignment from '../Modal/AddAssignment';

const UnassignedVendorsTable = ({ eventData, bookings, keyword, selectedIds, onSelectionChange }) => {
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

  const isUpcoming = eventData?.status === "Upcoming";
  const allFilteredIds = filteredBookings.map(b => b.bookingid);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(selectedIds.filter(id => !allFilteredIds.includes(id)));
    } else {
      onSelectionChange([...new Set([...selectedIds, ...allFilteredIds])]);
    }
  };

  const toggleOne = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(x => x !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

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
                {isUpcoming && (
                  <th>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      title="Select all"
                    />
                  </th>
                )}
                <th>Booking Date & Time</th>
                <th>Vendor Name</th>
                <th>Booth Name</th>
                <th>Booth Category</th>
                <th>Remark</th>
                {isUpcoming && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i}>
                  {isUpcoming && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(b.bookingid)}
                        onChange={() => toggleOne(b.bookingid)}
                      />
                    </td>
                  )}
                  <td>{b.bookingdatetime || '-'}</td>
                  <td>{b.vendorname || '-'}</td>
                  <td>{b.boothname || '-'}</td>
                  <td>{b.boothcategory || '-'}</td>
                  <td>{b.remark || '-'}</td>
                  {isUpcoming && (
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

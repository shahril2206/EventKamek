import React, { useState } from 'react';
import UpdateAssignment from '../Modal/UpdateAssignment';
import DeleteAssignment from '../Modal/DeleteAssignment';
import RefundDepoForm from '../Modal/RefundDepoForm';

const EventBoothTable = ({ eventData, assignments, onAssignmentUpdate, keyword }) => {
  const [isUpdateAssignmentOpen, setIsUpdateAssignmentOpen] = useState(false);
  const [isDeleteAssignmentOpen, setIsDeleteAssignmentOpen] = useState(false);
  const [isRefundAssignmentOpen, setIsRefundAssignmentOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const lowerKeyword = keyword?.toLowerCase() || '';

  const filteredAssignments = assignments.filter(a =>
    a.boothname?.toLowerCase().includes(lowerKeyword) ||
    a.boothcategory?.toLowerCase().includes(lowerKeyword) ||
    a.boothno?.toString().includes(lowerKeyword) ||
    a.vendorname?.toLowerCase().includes(lowerKeyword) ||
    a.vendoremail?.toLowerCase().includes(lowerKeyword) ||
    a.contactnum?.toLowerCase().includes(lowerKeyword) ||
    a.remark?.toLowerCase().includes(lowerKeyword)
  );

  const handleViewUpdate = (assignment) => {
    setSelectedAssignment(assignment);
    setIsUpdateAssignmentOpen(true);
  };

  const handleDepoAction = (assignment) => {
    setSelectedAssignment(assignment);
    setIsRefundAssignmentOpen(true);
  };

  const handleDelete = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteAssignmentOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateAssignmentOpen(false);
    setIsDeleteAssignmentOpen(false);
    setIsRefundAssignmentOpen(false);
    setSelectedAssignment(null);
  };

  return (
    <>
      <table className="booth-table">
        <thead>
          <tr>
            <th>Booth No.</th>
            <th>Booth Name</th>
            <th>Category</th>
            <th>Vendor</th>
            <th>Vendor Contact</th>
            <th>Remark</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((a, i) => (
            <tr key={i}>
              <td>{a.boothno || `#${i + 1}`}</td>
              <td>{a.boothname || '-'}</td>
              <td>{a.boothcategory || '-'}</td>
              <td>{a.boothname ? `${a.vendorname} (${a.vendoremail})` : '-'}</td>
              <td>{a.contactnum || '-'}</td>
              <td>{a.remark || '-'}</td>
              <td>
                {a.boothname ? (
                  eventData.status === "Upcoming" ? (
                    <>
                      <button className="booth-edit-btn" onClick={() => handleViewUpdate(a)}>View/Edit</button>
                      <button className="booth-unassign-btn" onClick={() => handleDelete(a)}>Remove</button>
                    </>
                  ) : eventData.status === "Ongoing" ? (
                    <button className="booth-edit-btn" onClick={() => handleViewUpdate(a)}>View</button>
                  ) : eventData.status === "Past" ? (
                    <button
                      onClick={() => handleDepoAction(a)}
                      className={!a.refundabledepostatus ? "booth-edit-btn" : "depo-settled-view-btn"}
                    >
                      {!a.refundabledepostatus ? "Refund/Forfeit Deposit" : "View"}
                    </button>
                  ) : null
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isUpdateAssignmentOpen && selectedAssignment && (
        <UpdateAssignment
          isOpen={isUpdateAssignmentOpen}
          onClose={handleCloseModal}
          selectedEvent={eventData}
          selectedAssignment={selectedAssignment}
        />
      )}

      {isDeleteAssignmentOpen && selectedAssignment && (
        <DeleteAssignment
          isOpen={isDeleteAssignmentOpen}
          onClose={handleCloseModal}
          selectedEvent={eventData}
          selectedAssignment={selectedAssignment}
        />
      )}

      {isRefundAssignmentOpen && selectedAssignment && (
        <RefundDepoForm
          isOpen={isRefundAssignmentOpen}
          onClose={handleCloseModal}
          selectedEvent={eventData}
          selectedAssignment={selectedAssignment}
        />
      )}
    </>
  );
};

export default EventBoothTable;


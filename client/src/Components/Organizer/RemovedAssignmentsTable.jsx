import React from 'react';

const RemovedAssignmentsTable = ({ assignments }) => {
  const cancelledAssignmentsCount = assignments.length;

  console.log("Cancelled Assignments:", assignments);

  return (
    <>
      {cancelledAssignmentsCount > 0 ? (
        <>
          <br />
          <p>The following table shows removed and refunded assignments</p>
          <table className="booth-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Cancellation Date & Time</th>
                <th>Vendor Name</th>
                <th>Booth Name</th>
                <th>Category</th>
                <th>Cancellation Remark</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr key={i}>
                  <td>{a.assignmentid}</td>
                  <td>{a.cancellationdatetime}</td>
                  <td>{a.vendorname || '-'}</td>
                  <td>{a.boothname || '-'}</td>
                  <td>{a.boothcategory || '-'}</td>
                  <td>{a.cancellationremark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <br />
          <p>No cancelled assignments for this event</p>
        </>
      )}
    </>
  );
};

export default RemovedAssignmentsTable;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EventBoothTable from '../../Components/Organizer/EventBoothTable';
import UnassignedVendorsTable from '../../Components/Organizer/UnassignedVendorsTable';
import RemovedAssignmentsTable from '../../Components/Organizer/RemovedAssignmentsTable';
import useStickyHeaderEffect from '../../hooks/useStickyHeaderEffect';

const EventBooths = () => {

  const [eventData, setEventData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [bookings, setBooking] = useState([]);
  const [cancelledAssignments, setCancelledAssignments] = useState([]);

  const [boothSearchKeyword, setBoothSearchKeyword] = useState('');
  const [vendorSearchKeyword, setVendorSearchKeyword] = useState('');
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);

  const { slug } = useParams();
  console.log("Slug:", slug);

  useEffect(() => {
    const fetchEventBoothDetails = async () => {
      try {
        // Step 1: Get eventId using slug
        const slugRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/events/${slug}`);
        const slugData = await slugRes.json();

        if (!slugRes.ok) throw new Error(slugData.error || "Failed to fetch event by slug");

        const eventId = slugData.eventid;
        console.log("Event ID:", eventId);

        // Step 2: Now fetch booth details using eventId
        const boothRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/eventbooths/${eventId}`);
        const boothData = await boothRes.json();

        setEventData(boothData.eventData);
        setAssignments(boothData.assignments);
        setBooking(boothData.bookings);
        setCancelledAssignments(boothData.cancelledAssignments || []);
      } catch (error) {
        console.error("Error fetching booth details:", error);
      }
    };

    fetchEventBoothDetails();
  }, [slug]);


  const handleAssignmentUpdate = (updatedAssignment) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === updatedAssignment.id ? updatedAssignment : a
      )
    );
  };

  useStickyHeaderEffect(); // Always run

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "text-green-600 underline";
      case "Ongoing":
        return "text-yellow-600 underline";
      default:
        return "text-red-600 underline";
    }
};

  return (
    <main>
      <div id="sentinel" className="h-[1px]"></div>

      <div className="heading-container">
        <h1>
          <Link className="hover:underline" to="/BoothsManagement">
            Booths Management
          </Link>{" > "}
          <span className="underline">{eventData.eventname || 'Loading...'}</span>
        </h1>

      </div>
      
      {eventData.boothbookingenabled === true ? (
        <>
        <div className="content-container border-1">
          <div className="booth-event-details">
            {eventData.eventstartdate === eventData.eventenddate ? (
              <p>
                <strong>Date:</strong> {eventData.eventstartdate}{" "}
                {eventData.status && (
                  <span className="text-green-600 underline">({eventData.status})</span>
                )}
              </p>
            ) : (
              <p>
                <strong>Date:</strong> {eventData.eventstartdate} - {eventData.eventenddate}{" "}
                <span className={getStatusColor(eventData.status)}>
                  ({eventData.status})
                </span>
              </p>
            )}
            <p>
              <strong>Location:</strong> {eventData.eventlocation}
            </p>
          </div>

          <div className="booth-list">
            <div className="booth-search-bar">
              {/* Booth search bar */}
            <input
              type="text"
              placeholder="Search Booths..."
              className="booth-searchbar"
              value={boothSearchKeyword}
              onChange={(e) => setBoothSearchKeyword(e.target.value)}
            />

            </div>
            <EventBoothTable
              eventData={eventData}
              assignments={assignments}
              onAssignmentUpdate={handleAssignmentUpdate}
              keyword={boothSearchKeyword}
            />
          </div>
        </div>

        <div className="content-container !mt-20 border-1">
          <div className="unassigned-vendors-section">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="unassigned-vendors-heading">Unassigned Vendors ({bookings.length})</h2>
              {eventData.status === "Upcoming" && selectedVendorIds.length > 0 && (
                <button
                  className="bulk-assign-btn"
                  onClick={async () => {
                    const confirmAssign = window.confirm(`Bulk assign ${selectedVendorIds.length} selected vendor(s) to available booths?`);
                    if (!confirmAssign) return;
                    try {
                      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/autoassign/${eventData.eventid}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bookingIds: selectedVendorIds }),
                      });
                      const data = await res.json();
                      alert(data.message || 'Bulk assignment complete');
                      setSelectedVendorIds([]);
                      window.location.reload();
                    } catch (error) {
                      alert('Bulk assignment failed');
                      console.error(error);
                    }
                  }}
                >
                  Bulk Assign ({selectedVendorIds.length})
                </button>
              )}
            </div>
            <div className="booth-search-bar">
              <input
                type="text"
                placeholder="Enter keywords..."
                className="booth-searchbar"
                value={vendorSearchKeyword}
                onChange={(e) => setVendorSearchKeyword(e.target.value)}
              />
            </div>
            <UnassignedVendorsTable
              eventData={eventData}
              bookings={bookings}
              keyword={vendorSearchKeyword}
              selectedIds={selectedVendorIds}
              onSelectionChange={setSelectedVendorIds}
            />
          </div>

          <div className="unassigned-vendors-section">
            <h2 className="unassigned-vendors-heading">Removed & Refunded Assignments ({cancelledAssignments.length})</h2>
            <RemovedAssignmentsTable assignments={cancelledAssignments} />
          </div>
        </div>
        </>
      ) : (
        <div className="content-container border-1 !rounded-xs !p-4">
          <p className="text-gray-500 text-center">
            This event does not include vendor booths.
          </p>
        </div>
      )}
    </main>
  );
};

export default EventBooths;

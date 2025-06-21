import React, { useEffect, useState } from 'react';
import ReadMyBooth from '../Modal/ReadMyBooth';

const MyBoothTable = ({ filter }) => {
  const [booths, setBooths] = useState([]);
  const [filteredBooths, setFilteredBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const vendoremail = localStorage.getItem('email');

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const res = await fetch(`https://eventkamek-production.up.railway.app/api/mybooths/${vendoremail}`);
        const text = await res.text();
        console.log('📦 Raw response:', text);

        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          console.error('❌ Unexpected response:', parsed);
          setBooths([]);
          return;
        }

        setBooths(parsed);
      } catch (err) {
        console.error('❌ Error fetching booths:', err.message);
        setBooths([]);
      } finally {
        setLoading(false);
      }
    };

    if (vendoremail) fetchBooths();
  }, [vendoremail]);

  useEffect(() => {
    let result = [...booths];

    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      result = result.filter(b =>
        b.eventname?.toLowerCase().includes(keyword) ||
        b.boothno?.toString().toLowerCase().includes(keyword) ||
        b.organizationname?.toLowerCase().includes(keyword) ||
        b.organizeremail?.toLowerCase().includes(keyword) ||
        b.boothname?.toLowerCase().includes(keyword)
      );
    }

    if (filter.fromDate) {
      result = result.filter(b => new Date(b.eventstartdate) >= new Date(filter.fromDate));
    }

    if (filter.toDate) {
      result = result.filter(b => new Date(b.eventstartdate) <= new Date(filter.toDate));
    }

    result = result.filter(b => {
      const status = b.eventstatus?.toLowerCase();
      return filter.status[status];
    });

    result.sort((a, b) => {
      const dateA = new Date(a.eventstartdate);
      const dateB = new Date(b.eventstartdate);
      return filter.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredBooths(result);
  }, [filter, booths]);

  const handleViewDetails = (booth) => {
    setSelectedBooth(booth);
    setSelectedEvent({
        eventslug: booth.eventslug,
        eventname: booth.eventname,
        eventstartdate: booth.eventstartdate,
        eventenddate: booth.eventenddate,
        eventlocation: booth.eventlocation,
        eventstatus: booth.eventstatus,
        organizationname: booth.organizationname,
        organizeremail: booth.organizeremail,
    });
  };

  const handleCloseModal = () => setSelectedBooth(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div>⏳ Loading your booths...</div>;

  return (
    <>
      <table className="booth-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Event Date</th>
            <th>Organizer</th>
            <th>Event Booth No.</th>
            <th>Booth Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooths.length > 0 ? (
            filteredBooths.map((booth, idx) => {
              const sameDate = booth.eventstartdate === booth.eventenddate;
              return (
                <tr key={idx}>
                  <td>{booth.eventname}</td>
                  <td>
                    {sameDate
                      ? `${formatDate(booth.eventstartdate)} (${booth.eventstatus})`
                      : `${formatDate(booth.eventstartdate)} - ${formatDate(booth.eventenddate)} (${booth.eventstatus})`}
                  </td>
                  <td>{booth.organizationname} <span className="text-sm text-gray-500 italic">({booth.organizeremail})</span></td>
                  <td>{booth.boothno}</td>
                  <td>{booth.boothname}</td>
                  <td>
                    <button className="booth-view-details" onClick={() => handleViewDetails(booth)}>
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No booths match your filters.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedBooth && (
        <ReadMyBooth
          event={selectedEvent}
          booth={selectedBooth}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default MyBoothTable;

import React, { useEffect, useState } from 'react';
import VendorCard from './VendorCard';

const VendorList = ({ eventId, isTheOrganizer }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${import.meta.env.API_BASE}/api/eventvendors/${eventId}`);
        const data = await res.json();
        setVendors(data.vendors || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchVendors();
  }, [eventId]);

  if (loading) return <p>Loading vendors...</p>;
  if (!vendors.length) return <p>No vendors assigned yet.</p>;

  return (
    <div className="vendor-list">
      {vendors.map((vendor, index) => (
        <VendorCard
          key={index}
          booth={vendor}
          isTheOrganizer={isTheOrganizer}
        />
      ))}
    </div>
  );
};

export default VendorList;

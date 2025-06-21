import React from 'react';
import { Link } from 'react-router-dom';

const VendorCard = ({ booth, isTheOrganizer }) => {
  if (!booth) return null;

  return (
    <div className="vendor-card hover:shadow-lg transition-shadow">
      <div className="vendor-card-header">
        <h3>
          {booth.boothname} <span className="italic text-gray-500">({booth.boothcategory})</span>
        </h3>
      </div>
      {isTheOrganizer ? (
        <>
          <p><strong>Booth Label: </strong>{booth.boothno}</p>
          <p><strong>Vendor Name: </strong>{booth.vendorname}</p>
          <p><strong>Vendor Email: </strong><Link className="text-blue-800 italic underline" to={`/Profile/Vendor/${booth.vendoremail}`}> {booth.vendoremail} </Link></p>
          <p><strong>Vendor Contact: </strong>{booth.contactnum}</p>
        </>
      ) : (
        <p><strong>Vendor: </strong> <Link className="text-blue-800 italic underline" to={`/Profile/Vendor/${booth.vendoremail}`}> {booth.vendorname} </Link></p>
      )}
    </div>
  );
};

export default VendorCard;

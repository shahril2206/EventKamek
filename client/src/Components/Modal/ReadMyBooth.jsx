import React from 'react';
import { Link } from 'react-router-dom';

const ReadMyBooth = ({
    isOpen = true, // Default to true for simple use
    event,
    booth,
    onClose,
}) => {
    if (!isOpen || !booth) return null;

    const {
        boothname,
        boothcategory,
        boothno,
        remark,
    } = booth;

    const {
        eventslug,
        eventname,
        eventstartdate = "N/A",
        eventenddate = "N/A",
        eventlocation,
        eventstatus,
        organizationname = "N/A",
        organizeremail = "N/A",
    } = event || {};

    // Helper to format date as "6 July 2025"
    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "N/A") return "N/A";
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="assignment-modal">
                <div className="assignment-form-heading">
                    <h2>View Assignment</h2>
                    <button
                        type="button"
                        className="close-modal-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div>
                    <h3>Event Info</h3>
                    <div className="info-section">
                        <p><strong>Event:</strong> <Link to={`/Events/${eventslug}`}> {eventname} </Link> <Link className="underline italic text-blue-800" to={`/Profile/Organizer/${organizeremail}`}> ({organizationname}) </Link></p>
                        {eventstartdate === eventenddate ? (
                            <p>
                                <strong>Date:</strong> {formatDate(eventstartdate)} ({eventstatus})
                            </p>
                        ) : (
                            <p>
                                <strong>Date:</strong> {formatDate(eventstartdate)} - {formatDate(eventenddate)} ({eventstatus})
                            </p>
                        )}
                        <p><strong>Venue:</strong> {eventlocation}</p>
                    </div>

                    <h3>Assignment Info</h3>
                    <div className="info-section">
                        <p><strong>Booth Name:</strong> {boothname}</p>
                        <p><strong>Booth Category:</strong> {boothcategory}</p>
                        <p><strong>Booth:</strong> {boothno}</p>
                        <p><strong>Remark:</strong> {remark}</p>
                    </div>

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReadMyBooth;

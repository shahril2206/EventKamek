import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteEvent = ({ isOpen, onClose, currentEvent }) => {
    if (!isOpen || !currentEvent) return null;

    const navigate = useNavigate();

    const handleDeleteEvent = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.API_BASE}/api/events/delete/${currentEvent.eventid}`, {
            method: 'DELETE',
            });

            const result = await response.json(); // ✅ Always parse the JSON

            if (!response.ok || result.success === false) {
            console.error('❌ Delete failed:', result);
            alert(result.message || 'Failed to delete event.');
            return;
            }

            alert(result.message || '✅ Event deleted successfully');
            onClose(); // Close the modal
            navigate("/"); // Go back to home or events list
        } catch (error) {
            console.error('❌ Error deleting event:', error);
            alert(`Server error occurred while deleting: ${error.message}`);
        }
    };


    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="delete-event-modal" role="dialog" aria-modal="true">
                <div className="flex">
                    <h2>Delete the following event?</h2>
                    <button
                        type="button"
                        className="close-modal-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <p className="event-title">{currentEvent.eventname}</p>
                {new Date(currentEvent.eventstartdate) === new Date(currentEvent.eventenddate) ? (
                    <p className="event-date">
                        {new Date(currentEvent.eventstartdate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                      })}
                    </p>
                ) : (
                    <p className="event-date">
                        {new Date(currentEvent.eventstartdate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}{ ' - ' }
                        {new Date(currentEvent.eventenddate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                )}
                <div className="modal-buttons">
                    <button onClick={handleDeleteEvent} id="confirmDelete">Confirm</button>
                    <button onClick={onClose} id="cancelDelete">Cancel</button>
                </div>
            </div>
        </>
    );
};

export default DeleteEvent;

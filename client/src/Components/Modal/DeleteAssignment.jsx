import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DeleteAssignment = ({ isOpen, onClose, selectedEvent, selectedAssignment }) => {
    const [assignment, setAssignment] = useState(null);
    const [cancellationremark, setCancellationRemark] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const assignmentid = selectedAssignment?.assignmentid || '';
    console.log('Assignment ID:', assignmentid);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${import.meta.env.API_BASE}/api/assignment/${assignmentid}`);
                if (!res.ok) throw new Error('Failed to fetch assignment data');
                const data = await res.json();
                setAssignment(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (assignmentid && isOpen) {
            fetchAssignment();
        }
    }, [assignmentid, isOpen]);

    if (!isOpen || !selectedEvent) return null;
    if (loading) return <div className="assignment-modal">Loading...</div>;
    if (error) return <div className="assignment-modal">Error: {error}</div>;
    if (!assignment) return null;

    const {
        eventname,
        eventstartdate,
        eventenddate,
        status,
        eventlocation,
    } = selectedEvent;

    const {
        vendorname,
        vendoremail,
        boothname,
        boothcategory,
        boothno,
        remark,
    } = assignment;

    const handleDelete = (e) => {
        e.preventDefault();

        const assignmentInfo = {
            assignmentid,
            eventname: selectedEvent.eventname,
            vendorname,
            boothname,
            boothcategory,
            boothno,
            cancellationremark,
        };

        navigate('/RefundCancelledBooking', { state: assignmentInfo });
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="assignment-modal">
                <div className="assignment-form-heading">
                    <h2 className="!text-red-700">Assignment Cancellation</h2>
                    <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleDelete}>
                    <h3>Event Info</h3>
                    <div className="info-section">
                        <p><strong>Event:</strong> {eventname}</p>
                        {eventstartdate === eventenddate ? (
                            <p><strong>Date:</strong> {eventstartdate} ({eventenddate})</p>
                        ) : (
                            <p><strong>Date:</strong> {eventstartdate} - {eventenddate} ({status})</p>
                        )}
                        <p><strong>Venue:</strong> {eventlocation}</p>
                    </div>

                    <h3>Assignment Info</h3>
                    <div className="info-section">
                        <p><strong>Vendor Name:</strong> {vendorname} <Link className="text-blue-800 italic underline text-sm" to={`/Profile/Vendor/${vendoremail}`}> ({vendoremail}) </Link></p>
                        <p><strong>Booth Name:</strong> {boothname}</p>
                        <p><strong>Booth Category:</strong> {boothcategory}</p>
                        <p><strong>Booth:</strong> {boothno}</p>
                        <p><strong>Remark:</strong> {remark}</p>
                        <div className="form-group">
                            <label htmlFor="cancellationRemark"><strong>Cancellation Remark:</strong></label>
                            <textarea
                                id="cancellationRemark"
                                name="cancellationremark"
                                rows={3}
                                className="form-control"
                                placeholder="Enter a remark for deletion/cancellation (optional)"
                                value={cancellationremark}
                                onChange={(e) => setCancellationRemark(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="to-refund-btn">Proceed to Refund</button>
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DeleteAssignment;

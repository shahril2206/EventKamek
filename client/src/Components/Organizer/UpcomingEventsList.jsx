import React from 'react'

const events = [
    {
        name: 'Tech Expo 2024',
        date: '2024-07-15',
        venue: 'Convention Center',
        booths: '12/20',
        slug: 'tech-expo-2024'
    },
    {
        name: 'Startup Summit',
        date: '2024-06-10',
        venue: 'City Hall',
        booths: '8/10',
        slug: 'startup-summit'
    }
];

const UpcomingEventsList = () => {

    const handleRowClick = (slug) => {
        window.location.href = `/Events/${slug}`;
    };

    return (
        <table className="my-events-table">
            <thead>
                <tr>
                    <th>Event Name</th>
                    <th>Event Date</th>
                    <th>Venue</th>
                    <th>Booths</th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => (
                    <tr key={event.slug}
                        onClick={() => handleRowClick(event.slug)}
                        title="Click to view event details"
                    >
                        <td>{event.name}</td>
                        <td>{event.date}</td>
                        <td>{event.venue}</td>
                        <td>{event.booths}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default UpcomingEventsList
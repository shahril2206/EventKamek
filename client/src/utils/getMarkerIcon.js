export const getMarkerIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    case 'ongoing':
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    case 'past':
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    default:
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  }
};
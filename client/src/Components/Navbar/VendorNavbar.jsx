import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const VendorNavbar = () => {
  const location = useLocation();
  const isEventsPage = location.pathname === '/' || location.pathname === '/Events';

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout(); // Clears localStorage and resets context
      navigate('/'); // Redirect to homepage or login page
    }
  };

  return (
    <nav className="Navbar">
        <ul className="Navbar_list">
            <li className="Navbar_item">
              <NavLink to="/Events" className={({ isActive }) => isEventsPage ? 'Navbar_link active' : 'Navbar_link'}>Events</NavLink>
            </li>
            <li className="Navbar_item">
              <NavLink to="/MyBooths" className={({ isActive }) => isActive ? 'Navbar_link active' : 'Navbar_link'}>My Booths</NavLink>
            </li>
            <li className="Navbar_item">
              <NavLink to="/MyProfile" className={({ isActive }) => isActive ? 'Navbar_link active' : 'Navbar_link'}>Profile</NavLink>
            </li>
            <li className="Navbar_item">
              <button onClick={handleLogout} className="Navbar_link hover:text-red-700 cursor-pointer" >
                Logout
              </button>
            </li>
        </ul>
    </nav>
  )
}

export default VendorNavbar

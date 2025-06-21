import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const PublicNavbar = () => {
  const location = useLocation();
  const isEventsPage = location.pathname === '/' || location.pathname === '/Events';

  return (
    <nav className="Navbar">
        <ul className="Navbar_list">
            <li className="Navbar_item">
              <NavLink to="/Events"  className={({ isActive }) => isEventsPage ? 'Navbar_link active' : 'Navbar_link'}>Events</NavLink>
            </li>
            <li className="Navbar_item">
              <NavLink to="/Login" className={({ isActive }) => isActive ? 'Navbar_link active' : 'Navbar_link'}>Log In</NavLink>
            </li>
            <li className="Navbar_item">
              <NavLink to="/Registration" className={({ isActive }) => isActive ? 'Navbar_link active' : 'Navbar_link'}>Sign Up</NavLink>
            </li>
        </ul>
    </nav>
  )
}

export default PublicNavbar

import React from 'react'
import PublicNavbar from './PublicNavbar';
import VendorNavbar from './VendorNavbar';
import OrganizerNavbar from './OrganizerNavbar';

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const MainNavbar = () => {
  const { role } = useContext(AuthContext);

  console.log('MainNavbar - Role:', role);

  return (
    <>
      {role === "" && <PublicNavbar />}
      {role === "vendor" && <VendorNavbar />}
      {role === "organizer" && <OrganizerNavbar />}
    </>
  )
}

export default MainNavbar

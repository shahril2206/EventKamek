import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'
import MainNavbar from '../Navbar/MainNavbar'
import { FaUser, FaSignOutAlt } from "react-icons/fa"; // Font Awesome icons

const Header = () => {
  return (
    <header className="Header">
      <Link to="/">
        <img className="logo" src={logo} alt="logo" />
      </Link>
      <MainNavbar />
    </header>
  )
}

export default Header

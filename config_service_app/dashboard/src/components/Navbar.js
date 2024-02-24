import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <div className="navbar-container">
    <ul className="navbar">
      <li><Link to="/">home</Link></li>
      <li><Link to="/">common configs</Link></li>
      <li><Link to="/selectDate" >archived</Link></li>
    </ul>
    </div>
  );
};

export default Navbar;
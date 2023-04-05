import React from 'react';
import logo from './LCPT_Logo2016_horizontal_for_referral copy.png';
import './header.css';

function Header() {
  return (
    <div className="header">
      <img src={logo} alt="Your Company Logo" className="logo" />
    </div>
  );
}

export default Header;
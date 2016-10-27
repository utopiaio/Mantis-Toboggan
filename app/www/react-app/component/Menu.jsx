import React from 'react';
import { Link } from 'react-router';

function Menu() {
  return (
    <div className="showtime-menu">
      <Link to="/show/c3" activeClassName="active" className="menu-item">
        <i className="menu-icon cinema-three" />
        <span className="menu-text">Cinema</span>
      </Link>

      <Link to="/show/c2" activeClassName="active" className="menu-item">
        <i className="menu-icon cinema-two" />
        <span className="menu-text">Cinema</span>
      </Link>

      <Link to="/show/c1" activeClassName="active" className="menu-item">
        <i className="menu-icon cinema-one" />
        <span className="menu-text">Cinema</span>
      </Link>

      <Link to="/setting" activeClassName="active" className="menu-item">
        <i className="menu-icon icon-setting" />
        <span className="menu-text">Settings</span>
      </Link>
    </div>
  );
}

module.exports = Menu;

import React from 'react';
import { Link } from 'react-router';

function Menu() {
  return (
    <div className="showtime-menu">
      <Link to="/show/c3" className="menu-item" activeClassName="active">
        <i className="menu-icon cinema-three" />
        <span className="menu-text menu-text-cinema" />
      </Link>

      <Link to="/show/c2" activeClassName="active" className="menu-item">
        <i className="menu-icon cinema-two" />
        <span className="menu-text menu-text-cinema" />
      </Link>

      <Link to="/show/c1" activeClassName="active" className="menu-item">
        <i className="menu-icon cinema-one" />
        <span className="menu-text menu-text-cinema" />
      </Link>

      <Link to="/setting" activeClassName="active" className="menu-item">
        <i className="menu-icon icon-setting" />
        <span className="menu-text menu-text-setting" />
      </Link>
    </div>
  );
}

module.exports = Menu;

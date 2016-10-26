import React from 'react';

function Menu() {
  return (
    <div className="showtime-menu">
      <div className="menu-item">
        <i className="menu-icon cinema-three" />
        <span className="menu-text">Cinema</span>
      </div>

      <div className="menu-item">
        <i className="menu-icon cinema-two" />
        <span className="menu-text">Cinema</span>
      </div>

      <div className="menu-item">
        <i className="menu-icon cinema-one" />
        <span className="menu-text">Cinema</span>
      </div>

      <div className="menu-item">
        <i className="menu-icon icon-setting" />
        <span className="menu-text">Settings</span>
      </div>
    </div>
  );
}

module.exports = Menu;

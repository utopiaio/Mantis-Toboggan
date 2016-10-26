import React from 'react';

function Menu() {
  return (
    <div className="showtime-menu">
      <div className="menu-item">
        <i className="menu-icon cinema-three" />
        <span className="menu-text">Cinema 3</span>
      </div>

      <div className="menu-item">
        <i className="menu-icon cinema-two" />
        <span className="menu-text">Cinema 2</span>
      </div>

      <div className="menu-item">
        <i className="menu-icon cinema-one" />
        <span className="menu-text">Cinema 1</span>
      </div>

      <div className="menu-item">
        <i className="menu-icon icon-setting" />
        <span className="menu-text">Setting</span>
      </div>
    </div>
  );
}

module.exports = Menu;

import React from 'react';
import NativeLink from './NativeLink.jsx';

function Menu() {
  return (
    <div className="showtime-menu">
      <NativeLink to="/show/c3" className="menu-item" activeClassName="active">
        <i className="menu-icon cinema-three" />
        <span className="menu-text menu-text-cinema" />
      </NativeLink>

      <NativeLink to="/show/c2" activeClassName="active" className="menu-item">
        <i className="menu-icon cinema-two" />
        <span className="menu-text menu-text-cinema" />
      </NativeLink>

      <NativeLink to="/show/c1" activeClassName="active" className="menu-item">
        <i className="menu-icon cinema-one" />
        <span className="menu-text menu-text-cinema" />
      </NativeLink>

      <NativeLink to="/setting" activeClassName="active" className="menu-item">
        <i className="menu-icon icon-setting" />
        <span className="menu-text menu-text-setting" />
      </NativeLink>
    </div>
  );
}

module.exports = Menu;

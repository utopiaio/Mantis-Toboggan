/* global window */
import React, { PropTypes } from 'react';
import history from '../config/history';

function NativeLink({ to, className, activeClassName, children }) {
  return (
    // eslint-disable-next-line
    <div
      onClick={() => history.push(to)}
      className={`${className} ${window.location.hash.includes(to) ? activeClassName : ''}`}
    >
      { children }
    </div>
  );
}

NativeLink.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
};

NativeLink.defaultProps = {
  className: '',
  activeClassName: 'active',
};

module.exports = NativeLink;

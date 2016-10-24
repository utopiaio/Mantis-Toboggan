import React, { PropTypes } from 'react';

function Header({ gc, am, appLanguage }) {
  return (
    <div className="app-header">
      <div className="app-header-date">
        { appLanguage === 'en' ? gc : am }
      </div>
    </div>
  );
}

Header.propTypes = {
  gc: PropTypes.string,
  am: PropTypes.string,
  appLanguage: PropTypes.string,
};

Header.defaultProps = {
  gc: 'gc',
  am: 'am',
  appLanguage: 'en',
};

module.exports = Header;

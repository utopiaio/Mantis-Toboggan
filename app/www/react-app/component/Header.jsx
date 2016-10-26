import React, { PropTypes } from 'react';

function Header({ gc, am, appLanguage }) {
  return (
    <div className={appLanguage === 'am' ? 'showtime-header dse' : 'showtime-header'}>
      <div className="header-date">
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
  gc: 'Tuesday October 26, 2017',
  am: 'ቃሎች',
  appLanguage: 'am',
};

module.exports = Header;

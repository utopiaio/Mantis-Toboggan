import React, { PropTypes } from 'react';

function Header({ gc, am, appLanguage, refresh }) {
  return (
    <div className={appLanguage === 'am' ? 'showtime-header -am-' : 'showtime-header'}>
      <div className="header-date">
        { appLanguage === 'en' ? gc : am }
      </div>

      <i className="icon-refresh" onClick={refresh} />
    </div>
  );
}

Header.propTypes = {
  gc: PropTypes.string,
  am: PropTypes.string,
  appLanguage: PropTypes.string,
  refresh: PropTypes.func.isRequired,
};

Header.defaultProps = {
  gc: 'Tuesday October 26, 2017',
  am: 'ማክሰኞ',
  appLanguage: 'am',
};

module.exports = Header;

import React, { PropTypes } from 'react';

function Header({ gc, am, language, refresh }) {
  return (
    <div className={language === 'am' ? 'showtime-header -am-' : 'showtime-header'}>
      <div className="header-date">
        { language === 'en' ? gc : am }
      </div>

      <i className="icon-refresh" onClick={refresh} />
    </div>
  );
}

Header.propTypes = {
  gc: PropTypes.string,
  am: PropTypes.string,
  language: PropTypes.string,
  refresh: PropTypes.func.isRequired,
};

Header.defaultProps = {
  gc: 'Tuesday October 26, 2017',
  am: 'ማክሰኞ',
  language: 'am',
};

module.exports = Header;

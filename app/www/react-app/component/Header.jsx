import React, { PropTypes } from 'react';

import Spinner from './Spinner.jsx';

function Header({ gc, am, language, refresh, loading }) {
  return (
    <div className={language === 'am' ? 'showtime-header -am-' : 'showtime-header'}>
      <div className="header-date">
        { language === 'en' ? gc : am }
      </div>

      <Spinner refresh={refresh} loading={loading} />
    </div>
  );
}

Header.propTypes = {
  gc: PropTypes.string,
  am: PropTypes.string,
  language: PropTypes.string,
  refresh: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

Header.defaultProps = {
  gc: 'Tuesday October 26, 2017',
  am: 'ማክሰኞ',
  language: 'am',
  loading: false,
};

module.exports = Header;

import React, { PropTypes } from 'react';

import amClass from './../util/amClass';

import Spinner from './Spinner.jsx';

function Header({ language, refresh, loading, ec, gc }) {
  return (
    <div className={`showtime-header ${amClass(language)}`}>
      <div className="showtime-header-date">
        { language === 'en' ? gc : ec }
      </div>

      <Spinner refresh={refresh} loading={loading} />
    </div>
  );
}

Header.propTypes = {
  language: PropTypes.string,
  refresh: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  gc: PropTypes.string,
  ec: PropTypes.string,
};

Header.defaultProps = {
  language: 'am',
  loading: false,
  gc: '1991-9-8',
  ec: '1991-9-8',
};

module.exports = Header;

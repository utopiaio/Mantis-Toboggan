import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import i18n from '../config/i18n';
import geez from './../util/geez';
import amClass from './../util/amClass';

function CinemaInfo({ to, language, cinemaLabel, movieCount }) {
  return (
    <Link to={to} activeClassName="active" className="btn cinema-movie-count">
      <div className={amClass(language)}>
        { `${i18n[language].CINEMA} ${cinemaLabel}` }
      </div>

      <div className={amClass(language)}>
        <strong>
          { language === 'am' ? geez(movieCount) : movieCount }
        </strong>
        <span>{ ` ${i18n[language][movieCount > 1 ? 'MOVIES' : 'MOVIE']}` }</span>
      </div>
    </Link>
  );
}

CinemaInfo.propTypes = {
  to: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  cinemaLabel: PropTypes.string.isRequired,
  movieCount: PropTypes.number.isRequired,
};

CinemaInfo.defaultProps = {};

module.exports = CinemaInfo;

/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import history from '../config/history';

class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const header = window.document.querySelector('.showtime-header');
    if (header !== null) {
      header.classList.add('_collapsed_');
    }

    const showtimeView = window.document.querySelector('.showtime-view');
    if (showtimeView) {
      showtimeView.style.overflowY = 'hidden';
    }

    setTimeout(() => {
      if (window.StatusBar !== undefined) {
        window.StatusBar.hide();
      }
    }, 250);
  }

  componentDidMount() {
    console.log('Movie CDM', this.props.params);
  }

  componentWillUnmount() {
    const header = window.document.querySelector('.showtime-header');
    if (header !== null) {
      header.classList.remove('_collapsed_');
    }

    const showtimeView = window.document.querySelector('.showtime-view');
    if (showtimeView) {
      showtimeView.style.overflowY = 'scroll';
    }

    setTimeout(() => {
      if (window.StatusBar !== undefined) {
        window.StatusBar.show();
      }
    }, 250);
  }

  render() {
    return (
      <div className="view-movie">
        <button className="close-button" onClick={history.goBack}>
          <i className="icon-close" />
        </button>
        <span>Movie, { this.props.params.movie }</span>
      </div>
    );
  }
}

Movie.propTypes = {
  params: PropTypes.shape({
    movie: PropTypes.string.isRequired,
  }).isRequired,
};

Movie.defaultProps = {};

module.exports = Movie;

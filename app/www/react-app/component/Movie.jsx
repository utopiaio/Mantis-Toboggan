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
      header.style.flex = '0 0 0';
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
      header.style.flex = '0 0 64px';
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
        <span>Movie, { this.props.params.movie }</span>
        <button onClick={history.goBack}>&lt; back</button>
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

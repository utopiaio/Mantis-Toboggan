/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import history from '../config/history';

import store from '../redux/store';
import i18n from '../config/i18n';
import amClass from '../util/amClass';
import containsFidel from '../util/containsFidel';

class Movie extends Component {
  constructor(props) {
    super(props);

    const state = store.getState();
    const { cinema, movie } = this.props.params;

    this.state = {
      poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].title : ''],
      movie: state.showtime.show[cinema][movie] || Object.create(null),
      language: state.language,
    };
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
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const { cinema, movie } = this.props.params;

      this.setState({
        poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].title : ''],
        movie: state.showtime.show[cinema][movie] || Object.create(null),
        language: state.language,
      });
    });
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

    this.unsubscribe();
  }

  render() {
    return (
      <div className="view-movie">
        <button className="close-button" onClick={history.goBack}>
          <i className="icon-close" />
        </button>

        <div className="poster-box" style={{ backgroundImage: `url(${encodeURI(this.state.poster)})` }} />

        <div className="movie-411">
          <h2 className={`light-font-weight movie-title ${containsFidel(this.state.movie.title) ? '_am_' : ''}`}>{ this.state.movie.title }</h2>
          <p className="movie-showtime _am_">{this.state.movie.time}</p>
          <h3 className={`movie-information light-font-weight ${amClass(this.state.language)}`}>{i18n[this.state.language].INFORMATION}</h3>
        </div>
      </div>
    );
  }
}

Movie.propTypes = {
  params: PropTypes.shape({
    movie: PropTypes.string.isRequired,
    cinema: PropTypes.string.isRequired,
  }).isRequired,
};

module.exports = Movie;

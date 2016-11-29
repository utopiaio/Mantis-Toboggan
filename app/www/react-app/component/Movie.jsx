/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';

import store from '../redux/store';
import { activeMovie } from '../redux/action/showtime';
import { showCloseButton, showMovieBackground, showPoster, setPosterSrc, enableScroll, showMovie411 } from '../util/DOMActions';

class Movie extends Component {
  componentWillMount() {
    enableScroll(false);

    setTimeout(() => {
      if (window.StatusBar !== undefined) {
        window.StatusBar.hide();
      }
    }, 250);
  }

  componentDidMount() {
    let state = store.getState();
    const { cinema, movie } = this.props.params;

    showMovieBackground(true);
    activeMovie(state.showtime.show[cinema][movie] || Object.create(null));
    showPoster(true, state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : '']).then(() => {
      showCloseButton(true);
      showMovie411(true);
    });

    this.unsubscribe = store.subscribe(() => {
      state = store.getState();
      setPosterSrc(state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : '']);
    });
  }

  componentWillUnmount() {
    if (window.StatusBar !== undefined) {
      window.StatusBar.show();
    }

    this.unsubscribe();
  }

  render() {
    return (
      <div />
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

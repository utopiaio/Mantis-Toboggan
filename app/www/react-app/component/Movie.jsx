/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';

import store from '../redux/store';
import { showCloseButton, showMovieBackground, showPoster, setPosterSrc, enableScroll, showMovie411 } from '../util/DOMActions';

class Movie extends Component {
  constructor(props) {
    super(props);

    const state = store.getState();
    const { cinema, movie } = this.props.params;

    this.state = {
      poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : ''],
      movie: state.showtime.show[cinema][movie] || Object.create(null),
    };
  }

  componentWillMount() {
    enableScroll(false);

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
        poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : ''],
        movie: state.showtime.show[cinema][movie] || Object.create(null),
      }, () => {
        setPosterSrc(this.state.poster);
      });
    });

    showMovieBackground(true);
    showPoster(true, this.state.poster).then(() => {
      showCloseButton(true);
      showMovie411(true);
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

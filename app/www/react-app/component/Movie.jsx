/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import anime from 'animejs';

import store from '../redux/store';
import { showCloseButton, showMovieBackground } from '../util/DOMActions';

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
        poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : ''],
        movie: state.showtime.show[cinema][movie] || Object.create(null),
      });
    });

    // getting location and dimension of the active poster
    const activePoster = window.document.querySelector('.movie-container.active .poster-container .img-poster');
    const rect = activePoster.getBoundingClientRect();
    const { top, left } = rect; // number
    let width = window.getComputedStyle(activePoster).width; // string
    width = Number(width.substring(0, width.length - 2)); // number
    let screenWidth = window.getComputedStyle(window.document.body).width;
    screenWidth = Number(screenWidth.substring(0, screenWidth.length - 2));

    // overlaying image on the active poster
    const moviePoster = window.document.querySelector('.movie-poster');
    moviePoster.src = this.state.poster;
    moviePoster.style.top = `${top}px`;
    moviePoster.style.left = `${left}px`;
    moviePoster.style.width = width;
    moviePoster.style.opacity = '1';

    // setting dataset...
    moviePoster.dataset.top = top;
    moviePoster.dataset.left = left;
    moviePoster.dataset.width = width;
    moviePoster.dataset.screenWidth = screenWidth;

    showMovieBackground(true);

    // scaling up the movie poster to fill the screen
    anime({
      targets: moviePoster,
      translateY: [`${0}px`, `-${top}px`],
      translateX: ['0px', `-${left}px`],
      width: [`${width}px`, `${screenWidth}px`],
      easing: 'easeOutExpo',
      duration: 750,
      elasticity: 100,
      complete() {
        showCloseButton(true);
      },
    });
  }

  componentWillUnmount() {
    setTimeout(() => {
      if (window.StatusBar !== undefined) {
        window.StatusBar.show();
      }

      const showtimeView = window.document.querySelector('.showtime-view');
      if (showtimeView) {
        showtimeView.style.overflowY = 'scroll';
      }
    }, 250);

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

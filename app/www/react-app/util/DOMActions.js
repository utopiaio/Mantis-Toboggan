/* global window */
/* eslint no-console: 0 */

import anime from 'animejs';

/**
 * this file contains _functions_ that do RAW DOM manipulations.
 * keeping our React Components _free_ of DOM hassle
 */

/**
 * shows or hides .close-button
 *
 * @param  {Boolean} show
 */
function showCloseButton(show = true, timeout = 0) {
  const closeButton = window.document.querySelector('.close-button');

  switch (show) {
    case true:
      setTimeout(() => {
        closeButton.style.transform = 'translateY(0em)';
        closeButton.style.opacity = '1';
      }, timeout);

      return;

    case false:
      closeButton.style.opacity = '0';
      setTimeout(() => {
        closeButton.style.transform = 'translateY(-2em)';
      }, timeout);
      return;

    default:
      console.warn(`Expected bool, instead got '${typeof show}'`);
  }
}

/**
 * shows or hides .view-movie-background
 * @param  {Boolean} show
 * @param {Number} timeout
 */
function showMovieBackground(show = true, timeout = 0) {
  const viewMovieBackground = window.document.querySelector('.view-movie-background');

  switch (show) {
    case true:
      setTimeout(() => {
        viewMovieBackground.style.transform = 'translateY(0vh)';
        viewMovieBackground.style.opacity = '1';
      }, timeout);
      return;

    case false:
      viewMovieBackground.style.opacity = '0';
      setTimeout(() => {
        viewMovieBackground.style.transform = 'translateY(100vh)';
      }, timeout);
      return;

    default:
      console.warn(`Expected bool, instead got '${typeof show}'`);
  }
}

/**
 * shows or hides .movie-poster
 * @param  {Boolean} show
 * @param  {String} src
 * @return {Promise | undefined}
 */
function showPoster(show = true, src = '') {
  const moviePoster = window.document.querySelector('.movie-poster');

  switch (show) {
    case true: {
      // looks for any previous anime, if found removes it
      // not having this causes race-condition issue #7
      if (anime.list.length > 0) {
        anime.remove(moviePoster);
        // resetting style after canceling anime...
        moviePoster.style.top = '0px';
        moviePoster.style.left = '0px';
        moviePoster.style.width = 'auto';
        moviePoster.style.borderRadius = '0em';
        moviePoster.style.transform = 'translateY(100vh)';
      }

      // getting location and dimension of the active poster
      const activePoster = window.document.querySelector('.movie-container.active .poster-container .img-poster');
      const rect = activePoster.getBoundingClientRect();
      const { top, left } = rect; // number
      let width = window.getComputedStyle(activePoster).width; // string
      width = Number(width.substring(0, width.length - 2)); // number
      // Not using window.screen.width because on Safari it returns the Mac's screen width, not
      // the phone width (even in responsive mode)
      let screenWidth = window.getComputedStyle(window.document.body).width;
      screenWidth = Number(screenWidth.substring(0, screenWidth.length - 2));

      // overlaying image on the active poster...
      moviePoster.src = src;
      moviePoster.style.top = `${top}px`;
      moviePoster.style.left = `${left}px`;
      moviePoster.style.width = width;
      moviePoster.style.opacity = '1';

      // setting dataset...
      moviePoster.dataset.top = top;
      moviePoster.dataset.left = left;
      moviePoster.dataset.width = width;
      moviePoster.dataset.screenWidth = screenWidth;

      return new Promise((resolve) => {
        // scaling up the movie poster to fill the screen
        anime({
          targets: moviePoster,
          translateY: ['0px', `${top > 0 ? `-${top}` : Math.abs(top)}px`],
          translateX: ['0px', `-${left}px`],
          width: [`${width}px`, `${screenWidth}px`],
          easing: 'easeOutExpo',
          duration: 500,
          elasticity: 100,
          complete() {
            resolve();
          },
        });
      });
    }

    case false: {
      const { top, left, width, screenWidth } = moviePoster.dataset;

      // setting border radius in the middle of scale-down animation
      setTimeout(() => {
        moviePoster.style.borderRadius = '.25em';
      }, 250);

      return new Promise((resolve) => {
        // scaling-down...
        anime({
          targets: moviePoster,
          translateY: [`-${top}px`, '0px'],
          translateX: [`-${left}px`, '0px'],
          width: [`${screenWidth}px`, `${width}px`],
          easing: 'easeOutExpo',
          duration: 500,
          opacity: {
            value: 0,
            delay: 300,
            easing: 'easeOutExpo',
          },
          elasticity: 100,
          complete() {
            // resetting style...
            moviePoster.style.top = '0px';
            moviePoster.style.left = '0px';
            moviePoster.style.width = 'auto';
            moviePoster.style.borderRadius = '0em';
            moviePoster.style.transform = 'translateY(100vh)';
            resolve();
          },
        });
      });
    }

    default:
      console.warn(`Expected bool, instead got '${typeof show}'`);
      return typeof show;
  }
}

/**
 * sets .movie-poster src
 *
 * @param {String} src
 */
function setPosterSrc(src = '') {
  window.document.querySelector('.movie-poster').src = src;
}

/**
 * enables/disabled scroll on .showtime-view
 *
 * @param  {Boolean} enable
 * @param  {Number}  timeout
 */
function enableScroll(enable = false, timeout = 0) {
  const showtimeView = window.document.querySelector('.showtime-view');

  switch (enable) {
    case true:
      setTimeout(() => {
        showtimeView.style.overflowY = 'scroll';
      }, timeout);
      return;

    case false:
      setTimeout(() => {
        showtimeView.style.overflowY = 'hidden';
      }, timeout);
      return;

    default:
      console.warn(`Expected bool, instead got '${typeof show}'`);
  }
}

module.exports = {
  showCloseButton,
  showMovieBackground,
  showPoster,
  setPosterSrc,
  enableScroll,
};

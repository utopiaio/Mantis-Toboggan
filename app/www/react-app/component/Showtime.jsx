/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import anime from 'animejs';

import history from '../config/history';
import i18n from '../config/i18n';
import store from '../redux/store';
import { showtime } from '../redux/action/showtime';

import Header from './Header.jsx';
import Menu from './Menu.jsx';

class Showtime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showtime: {
        show: {
          c3: [],
          c2: [],
          c1: [],
        },
        meta: {
          today: '1991-9-8',
          ec: '1991-9-8',
          gc: '1991-9-8',
        },
      },
      theme: 'night',
      language: 'en',
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });

    showtime();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  openWebsite(url) {
    if (url !== 'N/A' && window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(encodeURI(url), '_system');
    }
  }

  goBack() {
    const moviePoster = window.document.querySelector('.movie-poster');
    const { top, left, width, screenWidth } = moviePoster.dataset;

    const viewMovieBackground = window.document.querySelector('.view-movie-background');
    viewMovieBackground.style.opacity = '0';

    setTimeout(() => {
      moviePoster.style.borderRadius = '.25em';
      viewMovieBackground.style.transform = 'translateY(100vh)';
      history.goBack();
    }, 350);

    // turning off close button...
    const closeButton = window.document.querySelector('.close-button');
    closeButton.style.opacity = '0';
    setTimeout(() => {
      closeButton.style.transform = 'translateY(-2em)';
    }, 350);

    // scaling up the movie poster to fill the screen
    anime({
      targets: moviePoster,
      translateY: [`-${top}px`, '0px'],
      translateX: [`-${left}px`, '0px'],
      width: [`${screenWidth}px`, `${width}px`],
      easing: 'easeOutExpo',
      duration: 750,
      elasticity: 100,
      complete() {
        // resetting movie poster state...
        moviePoster.src = '';
        moviePoster.style.top = '0px';
        moviePoster.style.left = '0px';
        moviePoster.style.width = 'auto';
        moviePoster.style.opacity = '0';
        moviePoster.style.borderRadius = '0em';
        moviePoster.style.transform = 'translateY(100vh)';
      },
    });
  }

  render() {
    return (
      <div className={`showtime-app theme-${this.state.theme} language-${this.state.language}`}>
        <Header
          refresh={showtime}
          loading={this.state.loading}
          language={this.state.language}
          ec={this.state.showtime.meta.ec}
          gc={this.state.showtime.meta.gc}
        />

        <div className="showtime-view">
          { this.props.children }
        </div>

        <Menu />

        {/*
          To have proper stacking context movie view component will here _outside_

          Why:
          - The DOM is heavily animated, once entered there will be no updates on the view.
            So going _static_ will actually be faster.
          - Animation will be faster as react will not be consulted; I'm in charge.
          - To have proper stacking context so our z-index context will be the body tag.
        */}
        <button className="close-button" onClick={this.goBack}>
          <i className="icon-close" />
        </button>

        <img className="movie-poster" src="" alt="movie-poster" />

        <div className="view-movie-background" />

        <div className="movie-411">
          <h2 className="light-font-weight movie-title _am_">Movie Title</h2>
          <p className="movie-showtime _am_">Movie Showtime</p>
          <p className="movie-description">Movie Description</p>
          <table>
            <caption className="_am_">{i18n[this.state.language].INFORMATION}</caption>
            <tbody>
              <tr>
                <td>Rated</td>
                <td>Rated</td>
              </tr>

              <tr>
                <td>Released</td>
                <td>Released</td>
              </tr>

              <tr>
                <td>Genre</td>
                <td>Genre</td>
              </tr>

              <tr>
                <td>Director</td>
                <td>Director</td>
              </tr>

              <tr>
                <td>Cast</td>
                <td>Cast List</td>
              </tr>

              <tr>
                <td>Run Time</td>
                <td>Run Time</td>
              </tr>

              <tr>
                <td>Website</td>
                <td
                  className={`${'website' === 'N/A' ? '' : 'active'}`}
                  onClick={() => this.openWebsite('this state')}
                >
                  Website...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Showtime.propTypes = {
  children: PropTypes.element,
};

module.exports = Showtime;

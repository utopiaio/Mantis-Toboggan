/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';

import history from '../config/history';
import store from '../redux/store';
import { showtime, activeMovie } from '../redux/action/showtime';
import { showCloseButton, showMovieBackground, showPoster, setPosterSrc, enableScroll, showMovie411 } from '../util/DOMActions';

import Header from './Header.jsx';
import Menu from './Menu.jsx';
import Movie411 from './Movie411.jsx';

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
      movie: null,
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
    history.goBack();
    showMovieBackground(false);
    showCloseButton(false, 250).then(() => {
      if (window.StatusBar !== undefined) {
        window.StatusBar.show();
      }
    });
    enableScroll(true);
    showMovie411(false, 250).then(() => {
      showPoster(false).then(() => {
        setPosterSrc('');
        activeMovie(null);
      });
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

        <button className="close-button" onClick={this.goBack}>
          <i className="icon-close" />
        </button>

        <img className="movie-poster" src="" alt="movie-poster" />

        <div className="view-movie-background" />

        <Movie411
          language={this.state.language}
          movie={this.state.movie}
          open={this.openWebsite}
          back={this.goBack}
        />
      </div>
    );
  }
}

Showtime.propTypes = {
  children: PropTypes.element,
};

module.exports = Showtime;

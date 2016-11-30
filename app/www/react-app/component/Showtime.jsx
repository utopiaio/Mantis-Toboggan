/* global window */
/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';

import history from '../config/history';
import store from '../redux/store';
import i18n from '../config/i18n';
import amClass from '../util/amClass';
import containsFidel from '../util/containsFidel';
import { showtime, activeMovie } from '../redux/action/showtime';
import { showCloseButton, showMovieBackground, showPoster, setPosterSrc, enableScroll, showMovie411 } from '../util/DOMActions';

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

        {/*
          To have proper stacking context, some components will live _outside_

          Why:
          - To have proper stacking context for our z-index
          - The DOM is heavily animated, once entered there will be very little updates on the view.
            So going _static_ will actually be _faster_ (chasing that sweet 60fps).
        */}
        <button className="close-button" onClick={this.goBack}>
          <i className="icon-close" />
        </button>

        <img className="movie-poster" src="" alt="movie-poster" />

        <div className="view-movie-background" />

        <div className="movie-411">
          <div className="info-container">
            <h2 className={`light-font-weight movie-title ${containsFidel(this.state.movie && this.state.movie.title) ? '_am_' : ''}`}>{this.state.movie && this.state.movie.title}</h2>
            <p className="movie-showtime _am_">{this.state.movie && this.state.movie.time}</p>
            <p className="movie-description">
              { this.state.movie && this.state.movie.omdb && this.state.movie.omdb.Plot }
            </p>
            {
              (this.state.movie && this.state.movie.omdb) ? <h3 className={`movie-information ${amClass(this.state.language)}`}>
                <table>
                  <caption>{i18n[this.state.language].INFORMATION}</caption>
                  <tbody>
                    <tr>
                      <td>Rated</td>
                      <td>{ this.state.movie.omdb.Rated }</td>
                    </tr>

                    <tr>
                      <td>Released</td>
                      <td>{ this.state.movie.omdb.Released }</td>
                    </tr>

                    <tr>
                      <td>Genre</td>
                      <td>{ this.state.movie.omdb.Genre }</td>
                    </tr>

                    <tr>
                      <td>Director</td>
                      <td>{ this.state.movie.omdb.Director }</td>
                    </tr>

                    <tr>
                      <td>Cast</td>
                      <td>{ this.state.movie.omdb.Actors }</td>
                    </tr>

                    <tr>
                      <td>Run Time</td>
                      <td>{ this.state.movie.omdb.Runtime }</td>
                    </tr>

                    <tr>
                      <td>Website</td>
                      <td
                        className={`${this.state.movie.omdb.Website === 'N/A' ? '' : 'movie-website'}`}
                        onClick={() => this.openWebsite(this.state.movie.omdb.Website)}
                      >
                        <span>{ this.state.movie.omdb.Website.substring(0, 24) }</span>
                        { this.state.movie.omdb.Website.length > 24 ? <span>...</span> : <span /> }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </h3> : <span />
            }
            {
              (this.state.movie && this.state.movie.video) ? <div>
                <div className={`video-label ${amClass(this.state.language)}`}>
                  {i18n[this.state.language].VIDEO}
                </div>

                <div className="video-container">
                  <iframe
                    src={this.state.movie.video}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div> : <span />
            }
            <button
              style={{ margin: '1em 0% 1em 10%', width: '80%', padding: '.75em', minWidth: '12em' }}
              className={`btn ${amClass(this.state.language)}`}
              onClick={this.goBack}
            >{i18n[this.state.language].CLOSE}</button>
          </div>
        </div>
      </div>
    );
  }
}

Showtime.propTypes = {
  children: PropTypes.element,
};

module.exports = Showtime;

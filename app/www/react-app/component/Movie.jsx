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
      poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : ''],
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
        poster: state.poster[state.showtime.show[cinema][movie] ? state.showtime.show[cinema][movie].poster : ''],
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
          <p className="movie-description">
            { this.state.movie.omdb ? <span>{ this.state.movie.omdb.Plot }</span> : <span /> }
          </p>
          {
            this.state.movie.omdb ? <h3 className={`movie-information ${amClass(this.state.language)}`}>
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
                </tbody>
              </table>
            </h3> : <span />
          }
          {
            this.state.movie.video ? <div>
              <div className={`video-label ${amClass(this.state.language)}>{i18n[this.state.language].VIDEO}`}>
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

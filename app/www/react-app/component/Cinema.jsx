/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import store from '../redux/store';
import { poster } from '../redux/action/showtime';
import containsFidel from '../util/containsFidel';
import { PLACEHOLDER_POSTER, CERTIFIED_FRESH, FRESH_TOMATO, ROTTEN } from '../config/image';

const posterUrls = Object.create(null); // will be used to prevent _redundant_ poster action

class Cinema extends Component {
  constructor(props) {
    super(props);

    const state = store.getState();
    this.state = {
      poster: state.poster,
      show: state.showtime.show,
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.setState({
        poster: state.poster,
        show: state.showtime.show,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * given posterUrl, requests poster API if not found in LF
   *
   * @param  {String} posterUrl
   */
  poster(posterUrl) {
    if (Object.prototype.hasOwnProperty.call(posterUrls, posterUrl) === false) {
      posterUrls[posterUrl] = posterUrl; // this will block _redundant_ poster action
      poster(posterUrl);
    }

    return PLACEHOLDER_POSTER;
  }

  render() {
    return (
      <div className="view-showtime-list">
        {
          this.state.show[this.props.params.cinema].map((movie, index) =>
            <Link
              key={index}
              to={`/show/${this.props.params.cinema}/${index}`}
              className="movie-container"
              activeClassName="active"
            >
              <div className="poster-container">
                <img
                  className="img-poster"
                  src={encodeURI(this.state.poster[movie.poster] || this.poster(movie.poster))}
                  alt={movie.title}
                />
              </div>

              <div className="info-container">
                <div className={`movie-title ${containsFidel(movie.title) ? '_am_' : ''}`}>{ movie.title }</div>
                <div className="movie-showtime _am_">{movie.time}</div>
                {
                  movie.omdb && !Number.isNaN(Number(movie.omdb.tomatoMeter)) ?
                    <div className="movie-score-container">
                      <img
                        className="movie-score-img"
                        alt="tomato meter"
                        // eslint-disable-next-line
                        src={Number(movie.omdb.tomatoMeter) > 70 ? CERTIFIED_FRESH : Number(movie.omdb.tomatoMeter) > 59 ? FRESH_TOMATO : ROTTEN}
                      />
                      <span className="movie-score">{movie.omdb.tomatoMeter}</span>
                    </div>
                    : <span />
                }
              </div>
            </Link>,
          )
        }

        { this.props.children }
      </div>
    );
  }
}

Cinema.propTypes = {
  children: PropTypes.element,
  params: PropTypes.shape({
    cinema: PropTypes.string.isRequired,
  }).isRequired,
};

Cinema.defaultProps = {};

module.exports = Cinema;

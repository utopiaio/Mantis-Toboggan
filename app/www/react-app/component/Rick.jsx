import React, { Component } from 'react';
import { Link } from 'react-router';

import store from '../redux/store';
import i18n from '../config/i18n';
import geez from './../util/geez';
import amClass from './../util/amClass';

class Rick extends Component {
  constructor(props) {
    super(props);

    const state = store.getState();
    this.state = {
      poster: state.poster,
      show: state.showtime.show,
      language: state.language,
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.setState({
        poster: state.poster,
        language: state.language,
        show: state.showtime.show,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let uniqueMovies = Object.create(null);
    const uniqueMoviesPerCinema = { c1: {}, c2: {}, c3: {} };

    Object.keys(this.state.show).forEach((cinema) => {
      this.state.show[cinema].forEach((movie) => {
        uniqueMovies[movie.title] = movie.title;
      });
    });

    Object.keys(this.state.show).forEach((cinema) => {
      this.state.show[cinema].forEach((movie) => {
        uniqueMoviesPerCinema[cinema][movie.title] = movie.title;
      });
    });

    uniqueMovies = Object.keys(uniqueMovies).length;
    uniqueMoviesPerCinema.c3 = Object.keys(uniqueMoviesPerCinema.c3).length;
    uniqueMoviesPerCinema.c2 = Object.keys(uniqueMoviesPerCinema.c2).length;
    uniqueMoviesPerCinema.c1 = Object.keys(uniqueMoviesPerCinema.c1).length;

    return (
      <div className="view-rick">
        <h1 className={`light-font-weight ${amClass(this.state.language)}`}>
          { this.state.language === 'am' ? geez(`${uniqueMovies}`) : uniqueMovies }
          { ` ${i18n[this.state.language][uniqueMovies > 1 ? 'MOVIES' : 'MOVIE']}` }
        </h1>

        <div className="cinema-movie-count-container">
          <Link to="/show/c3" className="cinema-movie-count">
            <div className={amClass(this.state.language)}>
              { `${i18n[this.state.language].CINEMA} ${this.state.language === 'am' ? '፫' : '3'}` }
            </div>

            <div className={amClass(this.state.language)}>
              <strong>
                {
                  this.state.language === 'am'
                    ? geez(`${uniqueMoviesPerCinema.c3}`)
                    : uniqueMoviesPerCinema.c3
                }
              </strong>
              { ` ${i18n[this.state.language][uniqueMoviesPerCinema.c3 > 1 ? 'MOVIES' : 'MOVIE']}` }
            </div>
          </Link>

          <Link to="/show/c2" className="cinema-movie-count">
            <div className={amClass(this.state.language)}>
              { `${i18n[this.state.language].CINEMA} ${this.state.language === 'am' ? '፪' : '2'}` }
            </div>

            <div className={amClass(this.state.language)}>
              <strong>
                {
                  this.state.language === 'am'
                    ? geez(`${uniqueMoviesPerCinema.c2}`)
                    : uniqueMoviesPerCinema.c2
                }
              </strong>
              { ` ${i18n[this.state.language][uniqueMoviesPerCinema.c2 > 1 ? 'MOVIES' : 'MOVIE']}` }
            </div>
          </Link>

          <Link to="/show/c1" className="cinema-movie-count">
            <div className={amClass(this.state.language)}>
              { `${i18n[this.state.language].CINEMA} ${this.state.language === 'am' ? '፩' : '1'}` }
            </div>

            <div className={amClass(this.state.language)}>
              <strong>
                {
                  this.state.language === 'am'
                    ? geez(`${uniqueMoviesPerCinema.c1}`)
                    : uniqueMoviesPerCinema.c1
                }
              </strong>
              { ` ${i18n[this.state.language][uniqueMoviesPerCinema.c1 > 1 ? 'MOVIES' : 'MOVIE']}` }
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

module.exports = Rick;

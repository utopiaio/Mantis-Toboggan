import React, { Component } from 'react';

import store from '../redux/store';
import i18n from '../config/i18n';
import geez from './../util/geez';
import amClass from './../util/amClass';

import CinemaInfo from './CinemaInfo.jsx';

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
        <h1 className={`light-font-weight ${amClass(this.state.language)}`} style={{ marginTop: '0' }}>
          { this.state.language === 'am' ? geez(uniqueMovies) : uniqueMovies }
          { ` ${i18n[this.state.language][uniqueMovies > 1 ? 'MOVIES' : 'MOVIE']}` }
        </h1>

        <div className="cinema-movie-count-container">
          <CinemaInfo
            to="/show/c3"
            language={this.state.language}
            cinemaLabel={this.state.language === 'am' ? '፫' : '3'}
            movieCount={uniqueMoviesPerCinema.c3}
          />

          <CinemaInfo
            to="/show/c2"
            language={this.state.language}
            cinemaLabel={this.state.language === 'am' ? '፪' : '2'}
            movieCount={uniqueMoviesPerCinema.c2}
          />

          <CinemaInfo
            to="/show/c1"
            language={this.state.language}
            cinemaLabel={this.state.language === 'am' ? '፩' : '1'}
            movieCount={uniqueMoviesPerCinema.c1}
          />
        </div>
      </div>
    );
  }
}

module.exports = Rick;

/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import history from '../config/history';

class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('Movie CDM', this.props.params);
  }

  render() {
    return (
      <div className="view-movie">
        <span>Movie, { this.props.params.movie }</span>
        <button onClick={history.goBack}>&lt; back</button>
      </div>
    );
  }
}

Movie.propTypes = {
  params: PropTypes.shape({
    movie: PropTypes.string.isRequired,
  }).isRequired,
};

Movie.defaultProps = {};

module.exports = Movie;

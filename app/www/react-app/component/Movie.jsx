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

  goBack() {
    history.goBack();
  }

  render() {
    return (
      <div>
        Movie, { this.props.params.movie }
        <button onClick={this.goBack}>&lt; back</button>
      </div>
    );
  }
}

Movie.propTypes = {};

Movie.defaultProps = {};

module.exports = Movie;

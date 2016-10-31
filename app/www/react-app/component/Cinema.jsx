/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import store from '../redux/store';

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

  render() {
    return (
      <div className="view-rick">
        {
          this.state.show[this.props.params.cinema].map((movie, index) =>
            <Link key={index} to={`/show/${this.props.params.cinema}/${index}`}>
              <img
                className="img-poster"
                src={this.state.poster[movie.title] || movie.poster}
                alt={movie.title}
              />
            </Link>
          )
        }
        {this.props.children}
      </div>
    );
  }
}

Cinema.propTypes = {
  params: PropTypes.shape({
    cinema: PropTypes.string.isRequired,
  }).isRequired,
};

Cinema.defaultProps = {};

module.exports = Cinema;

import React, { Component, PropTypes } from 'react';

import store from '../redux/store';

class Rick extends Component {
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
        { this.state.show.c1.map((movie, index) =>
          <img
            className="img-poster"
            key={index}
            src={this.state.poster[movie.title] || movie.poster}
            alt={movie.title}
          />)
        }
      </div>
    );
  }
}

Rick.propTypes = {};

Rick.defaultProps = {};

module.exports = Rick;

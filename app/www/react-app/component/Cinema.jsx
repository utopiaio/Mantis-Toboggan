/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
    console.log(this.props);
    return (
      <div className="view-showtime-list">
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

        <ReactCSSTransitionGroup
          component="div"
          transitionName="fadeInUp-fadeOutDown"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          { React.cloneElement(this.props.children || <div />, { key: this.props.location.pathname || 'root' }) }
        </ReactCSSTransitionGroup>
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

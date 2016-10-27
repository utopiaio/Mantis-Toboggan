/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class Cinema extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('Cinema CDM', this.props.params);
  }

  componentWillReceiveProps(nexProps) {
    if (this.props.params.cinema !== nexProps.params.cinema) {
      console.log('Cinema CWRP', nexProps.params);
    }
  }

  render() {
    return (
      <div>
        Cinema {this.props.params.cinema}

        <Link to={`/show/${this.props.params.cinema}/storks`}>Storks</Link>

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

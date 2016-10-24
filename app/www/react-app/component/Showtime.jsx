/* global document, $ */
/* eslint no-console: 0 */

import React, { Component } from 'react';
import Header from './Header.jsx';

class Showtime extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // document.addEventListener('deviceready', () => {
    //   console.log('device ready...');
    // }, false);
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

module.exports = Showtime;

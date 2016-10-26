/* global document, $ */
/* eslint no-console: 0 */

import React, { Component } from 'react';
import Header from './Header.jsx';
import Menu from './Menu.jsx';

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

  refresh() {
    console.log('errrlow');
  }

  render() {
    return (
      <div>
        <Header refresh={this.refresh} />
        <div className="showtime-view">
          <h3>App View 3.0</h3>
        </div>
        <Menu />
      </div>
    );
  }
}

module.exports = Showtime;

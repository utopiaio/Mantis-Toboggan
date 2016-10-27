/* global document, $ */
/* eslint no-console: 0 */

import React, { Component } from 'react';

import store from '../redux/store';
import { showtime, language, theme, poster } from '../redux/action/showtime';

import Header from './Header.jsx';
import Menu from './Menu.jsx';

class Showtime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showtime: Object.create(null),
      theme: 'night',
      language: 'en',
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
      console.log(this.state);
    });

    showtime();
    // language('am');
    // theme('light');

    // document.addEventListener('deviceready', () => {
    //   console.log('device ready...');
    // }, false);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div>
        <Header refresh={showtime} />

        <div className="showtime-view">
          { this.props.children }
        </div>

        <Menu />
      </div>
    );
  }
}

module.exports = Showtime;

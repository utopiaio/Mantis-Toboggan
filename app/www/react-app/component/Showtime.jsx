/* global document, $ */
/* eslint no-console: 0 */

import React, { Component } from 'react';

import store from '../redux/store';
import { showtime } from '../redux/action/showtime';

import Header from './Header.jsx';
import Menu from './Menu.jsx';

class Showtime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showtime: {
        show: {
          c3: [],
          c2: [],
          c1: [],
        },
        meta: {
          today: '1991-9-8',
          ec: '1991-9-8',
          gc: '1991-9-8',
        },
      },
      theme: 'night',
      language: 'en',
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });

    showtime();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div className={`showtime-app theme-${this.state.theme}`}>
        <Header
          refresh={showtime}
          loading={this.state.loading}
          language={this.state.language}
          ec={this.state.showtime.meta.ec}
          gc={this.state.showtime.meta.gc}
        />

        <div className="showtime-view">
          { this.props.children }
        </div>

        <Menu />
      </div>
    );
  }
}

module.exports = Showtime;

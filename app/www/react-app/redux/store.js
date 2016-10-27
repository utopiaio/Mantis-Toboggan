/* global window */

import { createStore } from 'redux';

import showtime from './reducer/showtime';

const store = createStore(
  showtime,
  {
    showtime: Object.create(null),
    poster: Object.create(null),
    language: 'en',
    theme: 'night',
    loading: false,
  },
  window.devToolsExtension ? window.devToolsExtension() : undefined
);

module.exports = store;

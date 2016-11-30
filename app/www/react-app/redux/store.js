/* global window */

import { createStore } from 'redux';

import showtime from './reducer/showtime';

const store = createStore(
  showtime,
  {
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
    poster: Object.create(null),
    movie: Object.create(null),
    language: 'en',
    theme: 'night',
    loading: false,
  },
  window.devToolsExtension ? window.devToolsExtension() : undefined,
);

module.exports = store;

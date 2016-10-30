/* eslint no-console: 0 */

import localforage from 'localforage';
import request from 'superagent';

import { SHOWTIME, LANGUAGE, THEME, POSTER, LOADING, LF_SHOWTIME, LF_LANGUAGE, LF_THEME, LF_POSTER, API } from './../constant/showtime';
import store from './../store';

// configuring localforage...
localforage.config({
  name: 'showtime',
  storeName: 'showtime',
  description: 'showtime 3.0',
});

/**
 * bootting language and theme from localforage (~200ms)
 *
 * `showtime` is dispatched at app lauch
 */
Promise
  .all([
    localforage.getItem(LF_LANGUAGE),
    localforage.getItem(LF_THEME),
    localforage.getItem(LF_POSTER),
  ])
  .then(([lfLanguage, lfTheme, lfPoster]) => {
    if (lfLanguage !== null) {
      store.dispatch({
        type: LANGUAGE,
        language: lfLanguage,
      });
    }

    if (lfTheme !== null) {
      store.dispatch({
        type: THEME,
        theme: lfTheme,
      });
    }

    if (lfPoster !== null) {
      store.dispatch({
        type: POSTER,
        poster: lfPoster,
      });
    }
  });

/**
 * after a live API showtime dispatch
 * this saves the posters as base64 in LF
 *
 * pseudo-code:
 * 1. read urls from show
 * 4. make xhr requests
 * 5. store base64 (completely override previous)
 */
function savePosters(show) {
  console.log(show);
}

function showtime() {
  // only dispatching and making request if no request is pending
  if (store.getState().loading === false) {
    store.dispatch({
      type: LOADING,
      loading: true,
    });

    localforage
      .getItem(LF_SHOWTIME)
      .then((lfShowtime) => {
        if (lfShowtime !== null) {
          store.dispatch({
            type: SHOWTIME,
            showtime: lfShowtime,
          });
        }

        request
          .get(API)
          .query({ t: Date.now() }) // prevent cache on request
          .then((apiShowtime) => {
            store.dispatch({
              type: LOADING,
              loading: false,
            });

            if (apiShowtime.err || !apiShowtime.ok) {
              console.error(showtime.err);
            } else {
              store.dispatch({
                type: SHOWTIME,
                showtime: apiShowtime.body,
              });

              localforage.setItem(LF_SHOWTIME, apiShowtime.body);
              savePosters(apiShowtime.body.show);
            }
          })
          .catch(() => {
            // TODO: show error dialog here
            store.dispatch({
              type: LOADING,
              loading: false,
            });
          });
      });
  }
}

/**
 * language dispatch
 *
 * @param  {String} l 'am' | 'en'
 */
function language(l) {
  // optimistic update
  store.dispatch({
    type: LANGUAGE,
    language: l,
  });

  localforage.setItem(LF_LANGUAGE, l);
}

/**
 * theme dispatch
 *
 * @param  {String} t 'night' | 'light'
 */
function theme(t) {
  store.dispatch({
    type: THEME,
    theme: t,
  });

  localforage.setItem(LF_THEME, t);
}

/**
 * loading dispatch
 *
 * @param  {Boolean} l
 */
function loading(l) {
  store.dispatch({
    type: LOADING,
    loading: l,
  });
}

module.exports = {
  showtime,
  language,
  theme,
  loading,
};

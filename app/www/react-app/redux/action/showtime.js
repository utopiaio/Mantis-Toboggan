/* global window */
/* eslint no-console: 0 */

import localforage from 'localforage';
import request from 'superagent';

import { SHOWTIME, LANGUAGE, THEME, POSTER, LOADING, MOVIE, LF_SHOWTIME, LF_LANGUAGE, LF_THEME, LF_POSTER, API, POSTER_API } from './../constant/showtime';
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

      window.document.addEventListener('deviceready', () => {
        if (window.StatusBar !== undefined) {
          window.StatusBar[lfTheme === 'light' ? 'styleDefault' : 'styleLightContent']();
        }
      }, false);
    }

    if (lfPoster !== null) {
      store.dispatch({
        type: POSTER,
        poster: lfPoster,
      });
    }

    if (window.navigator.splashscreen !== undefined) {
      setTimeout(() => {
        window.navigator.splashscreen.hide();
      }, 250);
    }
  });

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
              if (window.navigator.notification) {
                window.navigator.notification.alert(
                  'Showtime is currently unavailable. Try again latter.',
                  () => {},
                  'Empty 😝',
                  'OK'
                );
              }
            } else {
              const show = apiShowtime.body.show;
              /**
               * when the server is being updated; all cinemas are removed
               * the server will be down for ~30 minutes or so. LF will stay intact
               * and show cached resources; if any.
               */
              if (show.c3.length === 0 && show.c2.length === 0 && show.c1.length === 0) {
                if (window.navigator.notification) {
                  window.navigator.notification.alert(
                    'EdnaMall\'s Showtime is currently empty.',
                    () => {},
                    'No Shows 🤔',
                    'OK'
                  );
                }
              } else {
                store.dispatch({
                  type: SHOWTIME,
                  showtime: apiShowtime.body,
                });

                localforage.setItem(LF_SHOWTIME, apiShowtime.body);
              }
            }
          })
          .catch(() => {
            store.dispatch({
              type: LOADING,
              loading: false,
            });

            if (window.navigator.notification) {
              window.navigator.notification.alert(
                'Unable to reach Showtime server. Try again latter.',
                () => {},
                'No Internet 😱',
                'OK'
              );
            }
          });
      });
  }
}

/**
 * given poster URL, requests poster API if not found in LF
 *
 * @param  {String} url
 */
function poster(url) {
  const state = store.getState();
  const LFP = state.poster;
  const LFP_CLEAN = Object.create(null);
  const { c1, c2, c3 } = state.showtime.show;

  if (Object.prototype.hasOwnProperty.call(LFP, url) === false) {
    request
      .get(POSTER_API)
      .query({ url })
      .then((base64) => {
        LFP[url] = base64.text;

        store.dispatch({
          type: POSTER,
          poster: LFP,
        });

        // rebuilding poster on LFP_CLEAN...
        [c1, c2, c3].forEach((cinema) => {
          cinema.forEach((movie) => {
            if (Object.prototype.hasOwnProperty.call(LFP, movie.poster)) {
              LFP_CLEAN[movie.poster] = LFP[movie.poster];
            }
          });
        });

        localforage
          .setItem(LF_POSTER, LFP_CLEAN)
          .catch((error) => {
            console.error(error);
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

  window.document.addEventListener('deviceready', () => {
    if (window.StatusBar !== undefined) {
      window.StatusBar[t === 'light' ? 'styleDefault' : 'styleLightContent']();
    }
  }, false);

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

/**
 * dispatch movie
 *
 * @param  {Object | null} m
 */
function activeMovie(movie) {
  store.dispatch({
    type: MOVIE,
    movie,
  });
}

module.exports = {
  showtime,
  poster,
  language,
  theme,
  loading,
  activeMovie,
};

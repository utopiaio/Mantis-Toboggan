/* global window */
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

const worker = new window.Worker('./react-app/worker/worker.js');

worker.onmessage = (e) => {
  switch (e.data.type) {
    case 'POSTER':
      localforage
        .setItem(LF_POSTER, e.data.posters)
        .then((lfPosterBase64) => {
          store.dispatch({
            type: LOADING,
            loading: false,
          });

          store.dispatch({
            type: POSTER,
            poster: lfPosterBase64,
          });
        })
        .catch((err) => {
          console.error(err);
        });
      break;

    case 'ERROR':
      store.dispatch({
        type: LOADING,
        loading: false,
      });
      break;

    default:
      console.warn(`unknown type [${e.data.type}] passed`);
      break;
  }
};

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
              console.error(showtime.err);
            } else {
              const show = apiShowtime.body.show;
              /**
               * when the server is being updated; all cinemas are removed
               * the server will be down for ~30 minutes or so. LF will stay intact
               * and show cached resources; if any.
               */
              if (show.c3.length === 0 && show.c2.length === 0 && show.c1.length === 0) {
                console.log('API is empty - skipping...');
              } else {
                store.dispatch({
                  type: SHOWTIME,
                  showtime: apiShowtime.body,
                });

                localforage.setItem(LF_SHOWTIME, apiShowtime.body);

                // turning loading sate to ON as it might take a while to load all the images
                // some are 2MB+
                store.dispatch({
                  type: LOADING,
                  loading: true,
                });

                worker.postMessage({
                  type: 'POSTER',
                  show: apiShowtime.body.show,
                  lfPoster: store.getState().poster,
                });
              }
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

module.exports = {
  showtime,
  language,
  theme,
  loading,
};

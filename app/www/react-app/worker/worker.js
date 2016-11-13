/* eslint no-console: 0 */
/* global self, postMessage */

/**
 * after a live API showtime dispatch
 * this saves the posters as base64 in LF
 *
 * pseudo-code:
 * 1. read urls from show
 * 4. make xhr requests
 * 5. store base64 (completely override previous)
 */
function savePosters(show, lfPoster) {
  return new Promise((resolve, reject) => {
    const posters = Object.create(null); // { movieTitle: posterUrl }
    const postersPromises = []; // [ XMLHttpRequest Promise, ]

    Object.keys(show).forEach((cinema) => {
      show[cinema].forEach((movie) => {
        posters[movie.title] = movie.poster;
      });
    });

     /**
     * given a poster url return a promise with base64 encoding
     *
     * @param  {String} url
     * @return {Promise}
     */
    const savePosterPromise = url => new Promise((savePoster) => {
      const req = new self.XMLHttpRequest();
      req.open('GET', url);
      req.responseType = 'blob';
      req.onload = () => {
        const reader = new self.FileReader();
        reader.onloadend = () => { savePoster(reader.result); };
        reader.readAsDataURL(req.response);
      };
      req.send();
    });

    const postersKeys = Object.keys(posters);
    postersKeys.forEach((title) => {
      if (Object.prototype.hasOwnProperty.call(lfPoster, title) === false || lfPoster[title].startsWith('http')) {
        // adding to XHR promise...
        postersPromises.push(savePosterPromise(posters[title]));
      } else {
        // replacing movie poster url with one from LF..
        posters[title] = lfPoster[title];
      }
    });

    Promise
      .all(postersPromises)
      .then((posterPromisesData) => {
        posterPromisesData.forEach((posterBase64, index) => {
          posters[postersKeys[index]] = posterBase64;
        });

        resolve(posters);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// eslint-disable-next-line
onmessage = (e) => {
  switch (e.data.type) {
    case 'POSTER':
      savePosters(e.data.show, e.data.lfPoster)
        .then((data) => {
          postMessage({
            type: e.data.type,
            posters: data,
          });
        })
        .catch((error) => {
          postMessage({
            type: 'ERROR',
            error,
          });
        });
      break;

    default:
      console.warn(`unknown type [${e.data.type}] passed`);
      break;
  }
};

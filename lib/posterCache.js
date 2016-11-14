/* eslint no-console: 0 */

const base64 = require('./base64');

/**
 * checks for cache in our showtime poster db
 *
 * @param  {Object} moedoo
 * @param  {String} title
 * @param {Object} detail
 * @return {Promise}
 */
module.exports = (moedoo, url = '') => new Promise((resolve, reject) => {
  moedoo
    .query('SELECT poster FROM poster WHERE url = $1;', [url])
    .then((result) => {
      if (result.length === 1) {
        resolve(result[0].poster);
      } else {
        base64(url)
          .then((response) => {
            resolve(response);

            moedoo
              .query('INSERT INTO poster (url, poster) VALUES ($1, $2) returning poster;', [url, response])
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
});

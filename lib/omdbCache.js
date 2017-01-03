const request = require('superagent');

const date = new Date();

/**
 * checks for cache in our showtime omdb db
 *
 * @param  {Object} moedoo
 * @param  {String} title
 * @param  {Object} detail
 * @return {Promise}
 */
module.exports = (moedoo, title = '', detail) => new Promise((resolve, reject) => {
  if (detail === undefined) {
    moedoo
      .query('SELECT detail FROM omdb WHERE title = $1;', [title])
      .then((result) => {
        if (result.length === 1) {
          resolve(result[0].detail);
        } else {
          request('GET', `https://omdbapi.com/?t=${encodeURI(decodeURI(title))}&tomatoes=true&y=${date.getFullYear()}`)
            .then((response) => {
              resolve(response);
            });
        }
      });
  } else {
    moedoo
      .query('INSERT INTO omdb (title, detail) VALUES ($1, $2) returning detail;', [title, detail])
      .then((result) => {
        resolve(result[0].detail);
      })
      .catch((err) => {
        reject(err);
      });
  }
});

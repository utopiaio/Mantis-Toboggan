const lw5 = require('lw5');
const cloneDeep = require('lodash/cloneDeep');

/**
 * checks for cache in our showtime rtdb db
 *
 * @param  {Object} moedoo
 * @param  {String} title
 * @param  {Object} detail
 * @return {Promise}
 */
const lw5Cache = (moedoo, title = '', detail) => new Promise((resolve, reject) => {
  if (detail === undefined) {
    moedoo
      .query('SELECT detail FROM rtdb WHERE title = $1;', [title])
      .then((result) => {
        if (result.length === 1) {
          resolve(result[0].detail);
          return;
        }

        lw5(title)
          .then((movie411) => {
            lw5Cache(moedoo, title, cloneDeep(movie411));
            resolve(cloneDeep(movie411));
          }, () => {
            lw5Cache(moedoo, title, null);
            resolve(null);
          });
      }, () => {
        resolve(null);
      });

    return;
  }

  moedoo
    .query('INSERT INTO rtdb (title, detail) VALUES ($1, $2) returning detail;', [title, detail])
    .then((result) => {
      resolve(result[0].detail);
    }, (err) => {
      reject(err);
    });
});

module.exports = lw5Cache;

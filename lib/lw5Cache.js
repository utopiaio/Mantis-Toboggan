const lw5 = require('lw5');

/**
 * checks for cache in our showtime omdb db
 *
 * @param  {Object} moedoo
 * @param  {String} title
 * @param  {Object} detail
 * @return {Promise}
 */
const lw5Cache = (moedoo, title = '', detail) => new Promise((resolve, reject) => {
  if (detail === undefined) {
    moedoo
      .query('SELECT detail FROM omdb WHERE title = $1;', [title])
      .then((result) => {
        if (result.length === 1) {
          resolve(result[0].detail);
          return;
        }

        lw5(title)
          .then((movie411) => {
            lw5Cache(moedoo, title, Object.assign(Object.create(null), movie411));
            resolve(movie411);
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
    .query('INSERT INTO omdb (title, detail) VALUES ($1, $2) returning detail;', [title, detail])
    .then((result) => {
      resolve(result[0].detail);
    }, (err) => {
      reject(err);
    });
});

module.exports = lw5Cache;

/**
 * checks for cache in our showtime omdb db
 *
 * @param  {Object} moedoo
 * @param  {String} title
 * @param {Object} detail
 * @return {Promise}
 */
module.exports = (moedoo, title = '', detail) => new Promise((resolve, reject) => {
  if (detail === undefined) {
    moedoo
      .query('SELECT detail FROM omdb WHERE title = $1;', [title])
      .then((result) => {
        resolve(result.length === 1 ? result[0].detail : 'ø');
      })
      .catch(() => {
        resolve('ø');
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

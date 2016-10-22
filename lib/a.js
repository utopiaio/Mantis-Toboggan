/* eslint no-console: 0 */

const cheerio = require('cheerio');
const request = require('superagent');
const moviedb = require('moviedb')('9dfa5be3ff1365016f74e42708d8dcd2');

const URL = 'http://ednamall.co/';
const api_key = '9dfa5be3ff1365016f74e42708d8dcd2';
let genres = [];

/**
 * Genre List:
 * https://api.themoviedb.org/3/genre/movie/list?api_key=<API-KEY>&language=en-US
 *
 * Movie 411:
 * https://api.themoviedb.org/3/search/movie?api_key=<API-KEY>&query=<MOVIE>&include_adult=true
 */

request
  .get('https://api.themoviedb.org/3/genre/movie/list')
  .query({ api_key, language: 'en-US' })
  .end((err, response) => {
    if (err === null) {
      genres = response.body.genres;
      console.log(genres);
    } else {
      console.log(err);
    }
  });

/**
 * a (get it) scraper targeting http://ednamall.co/
 */
module.exports = new Promise((resolve, reject) => {
  request
    .get(encodeURI(decodeURI(URL))) // makes sure we don't run into double-encoding scenario
    .end((err, res) => {
      if (err || !res.ok) {
        reject(err);
      } else {
        // loading the body in cheerio...
        const $ = cheerio.load(res.text);

        /**
         * First h3 tag under section#main contains todays days in YYYY-MM-YY format
         * IF we get an array of length 3 the system is in accordance with our scrapper
         */
        const today = $('body section#main header > h3').text().trim().match(/\d{2,4}/g);

        /**
         * first three div.row contain cinema 3, 2 & 1 respectively
         */
        const [c3, c2, c1] = $('body section#main div.row').splice(0, 3).map(cinema =>
          $('div', cinema).splice(1).map(div => ({
            title: $('a', div).text().trim(),
            poster: $('img', div).attr('src'),
            time: $('ul', div).text().trim(),
          }))
        );

        resolve({
          show: { c3, c2, c1 },
          meta: {
            today: today.join('-'), // YYYY-MM-DD
          },
        });
      }
    });
});


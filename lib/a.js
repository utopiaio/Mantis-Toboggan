/* eslint no-console: 0 */

const cheerio = require('cheerio');
const request = require('superagent');

const URL = 'http://ednamall.co/';

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
            detail: `${URL}${$('a', div).attr('href')}`,
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


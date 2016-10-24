/* eslint no-console: 0 */

const cheerio = require('cheerio');
const request = require('superagent');

const omdbCache = require('./omdbCache');
const detailCache = require('./detailCache');

const URL = 'http://ednamall.co/';
const date = new Date();

/**
 * a (get it) scraper targeting http://ednamall.co/
 */
module.exports = (moedoo) => {
  return () => new Promise((resolve, reject) => {
    request
      .get(encodeURI(decodeURI(URL))) // makes sure we don't run into double-encoding scenario
      .then((res) => {
        // loading the body in cheerio...
        const $ = cheerio.load(res.text);

        /**
         * First h3 tag under section#main contains todays days in YYYY-MM-YY format
         * IF we get an array of length 3 the system is in accordance with our scrapper
         */
        const today = $('body section#main header > h3')
          .text()
          .trim()
          .match(/\d{2,4}/g)
          .map(p => Number(p));
        const moviesDetail = Object.create(null); // this will hold movie detail pages...
        const moviesTitle = Object.create(null); // this will hold movie titles...

        /**
         * first three div.row contain cinema 3, 2 & 1 respectively
         */
        const [c3, c2, c1] = $('body section#main div.row').splice(0, 3).map(cinema =>
          $('div', cinema).splice(1).map((div) => {
            const detail = `${URL}${$('a', div).attr('href')}`;
            const title = $('a', div).text().trim();
            moviesDetail[detail] = detail;
            moviesTitle[title] = title;

            return {
              title,
              poster: $('img', div).attr('src'),
              time: $('ul', div).text().trim(),
              detail,
            };
          })
        );

        // going through details page and getting videos (if any)...
        // $('iframe[src*="youtube"]') | ('iframe[src*="imdb"]')
        const moviesDetailKeys = Object.keys(moviesDetail);
        const moviesDetailKeysPromises = moviesDetailKeys.map(detail => request('GET', detail));

        Promise
          .all(moviesDetailKeysPromises)
          .then((moviesDetailKeysData) => {
            moviesDetailKeysData.forEach((moviesDetailKeyResponse, index) => {
              const youtube = cheerio.load(moviesDetailKeyResponse.text)('iframe[src*="youtube"]');
              const imdb = cheerio.load(moviesDetailKeyResponse.text)('iframe[src*="imdb"]');
              moviesDetail[moviesDetailKeys[index]] = youtube.length > 0 ? youtube.attr('src') : null;
              // checking imdb embed if YouTube is not found...
              if (moviesDetail[moviesDetailKeys[index]] === null) {
                moviesDetail[moviesDetailKeys[index]] = imdb.length > 0 ? imdb.attr('src') : null;
              }
            });

            // hitting omdb to get synopsis...
            const moviesTitleKeys = Object.keys(moviesTitle);
            const moviesTitleKeysPromises = moviesTitleKeys.map(title => request('GET', `https://omdbapi.com/?t=${encodeURI(decodeURI(title))}&tomatoes=true&y=${date.getFullYear()}`));

            Promise
              .all(moviesTitleKeysPromises)
              .then((moviesTitleKeysData) => {
                moviesTitleKeysData.forEach((moviesTitleKeyResponse, index) => {
                  if (moviesTitleKeyResponse.body.Response === 'False') {
                    moviesTitle[moviesTitleKeys[index]] = null;
                  } else if (
                    moviesTitleKeyResponse.body.Title.toLocaleLowerCase() ===
                    moviesTitle[moviesTitleKeys[index]].toLocaleLowerCase()
                  ) {
                    moviesTitle[moviesTitleKeys[index]] = moviesTitleKeyResponse.body;
                  } else {
                    moviesTitle[moviesTitleKeys[index]] = null;
                  }
                });

                // filling details...
                // we'll be mutating (fix your face, yes, mutating) initial c3, c2 & c1...
                [c3, c2, c1].forEach((c) => {
                  c.forEach((show, index) => {
                    // eslint-disable-next-line
                    c[index].video = moviesDetail[c[index].detail];
                    // eslint-disable-next-line
                    c[index].omdb = moviesTitle[c[index].title];
                  });
                });

                resolve({
                  show: { c3, c2, c1 },
                  meta: {
                    today: today.join('-'), // YYYY-M-D
                  },
                });
              });
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

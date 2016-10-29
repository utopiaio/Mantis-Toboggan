/* eslint no-console: 0 */

const cheerio = require('cheerio');
const request = require('superagent');

const config = require('./../config');
const omdbCache = require('./omdbCache');
const detailCache = require('./detailCache');
const { gregorianToEthiopic, ethiopicMonthToFullEthiopicMonth } = require('./ec');

/**
 * a (get it) scraper targeting http://ednamall.co/
 */
module.exports = moedoo => () => new Promise((resolve, reject) => {
  request
    .get(encodeURI(decodeURI(config.EDNA_URL)))
    .then((res) => {
      // loading the body in cheerio...
      const $ = cheerio.load(res.text);

      /**
       * First h3 tag under section#main contains todays days in YYYY-MM-YY format
       * IF we get an array of length 3 the system is in accordance with our scrapper
       */
      const [year, month, day] = $('body section#main header > h3')
        .text()
        .trim()
        .match(/\d{2,4}/g)
        .map(p => Number(p));
      const gc = moment(`${year}-${month}-${day}`, 'YYYY-M-D');
      const ec = gregorianToEthiopic(year, month, day);
      const moviesDetail = Object.create(null); // this will hold movie detail pages...
      const moviesTitle = Object.create(null); // this will hold movie titles...

      /**
       * first three div.row contain cinema 3, 2 & 1 respectively
       */
      const [c3, c2, c1] = $('body section#main div.row').splice(0, 3).map(cinema =>
        $('div', cinema).splice(1).map((div) => {
          const detail = `${config.EDNA_URL}${$('a', div).attr('href')}`;
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
      const moviesDetailKeysPromises = moviesDetailKeys.map(detail => detailCache(moedoo, detail));

      Promise
        .all(moviesDetailKeysPromises)
        .then((moviesDetailKeysData) => {
          moviesDetailKeysData.forEach((moviesDetailKeyResponse, index) => {
            if (moviesDetailKeyResponse === null || typeof moviesDetailKeyResponse === 'string') {
              moviesDetail[moviesDetailKeys[index]] = moviesDetailKeyResponse;
            } else {
              const youtube = cheerio.load(moviesDetailKeyResponse.text)('iframe[src*="youtube"]');
              const imdb = cheerio.load(moviesDetailKeyResponse.text)('iframe[src*="imdb"]');
              moviesDetail[moviesDetailKeys[index]] = youtube.length > 0 ? youtube.attr('src') : null;
              // checking imdb embed if YouTube is not found...
              if (moviesDetail[moviesDetailKeys[index]] === null) {
                moviesDetail[moviesDetailKeys[index]] = imdb.length > 0 ? imdb.attr('src') : null;
              }

              detailCache(moedoo, moviesDetailKeys[index], moviesDetail[moviesDetailKeys[index]])
                .catch((err) => {
                  console.error(err);
                });
            }
          });

          // hitting omdb to get synopsis...
          const moviesTitleKeys = Object.keys(moviesTitle);
          const moviesTitleKeysPromises = moviesTitleKeys.map(title => omdbCache(moedoo, title));

          Promise
            .all(moviesTitleKeysPromises)
            .then((moviesTitleKeysData) => {
              moviesTitleKeysData.forEach((moviesTitleKeyResponse, index) => {
                if (moviesTitleKeyResponse === null || Object.prototype.hasOwnProperty.call(moviesTitleKeyResponse, 'body') === false) {
                  moviesTitle[moviesTitleKeys[index]] = moviesTitleKeyResponse;
                } else {
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

                  omdbCache(moedoo, moviesTitleKeys[index], moviesTitle[moviesTitleKeys[index]])
                    .catch((err) => {
                      console.error(err);
                    });
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
                  today: `${year}-${month}-${day}`, // YYYY-M-D
                  gc: `${gc.format('dddd, MMMM D')}`, // dddd, MMMM D
                  ec: `${gregorianWeekdayToEthiopicWeekday(gc.format('dddd'))}, ${ethiopicMonthToFullEthiopicMonth(ec.month)}, ${ec.day}`, // dddd, MMMM D
                },
              });
            });
        });
    })
    .catch((err) => {
      reject(err);
    });
});

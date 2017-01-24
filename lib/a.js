/* eslint no-console: 0 */

const cheerio = require('cheerio');
const request = require('superagent');
const moment = require('moment');
const geezer = require('geezer');
const { ge } = require('ethiopic-calendar');

const config = require('./../config');
const omdbCache = require('./omdbCache');
const detailCache = require('./detailCache');
const { gregorianWeekdayToEthiopicWeekday, ethiopicMonthToFullEthiopicMonth } = require('./ec');

/**
 * a (get it) scraper targeting http://ednamall.co/
 */
module.exports = moedoo => () => new Promise((resolve, reject) => {
  request
    .get(encodeURI(decodeURI(config.URL)))
    .then((res) => {
      // loading the body in cheerio...
      const $ = cheerio.load(res.text);
      const EDNA_MAIN_SELECTOR = '.showtimes-theater-header a.light.showtimes-theater-title[href*="Edna Cinema"]';
      const DD_MM_YY_SELECTOR = 'ul.date-picker li a.date-area.date-selected';

      // Checking for Edna Schedule...
      if ($(EDNA_MAIN_SELECTOR).length === 0) {
        reject('no Edna shows yet');
        return;
      }

      // Reading site date...
      const [month, date, year] = $(DD_MM_YY_SELECTOR).attr('href').match(/([0-9]{2})/g);
      // Gregorian Calendar Moment
      const gCMoment = moment(`${date}-${month}-${year}`, 'DD-MM-YY');
      // Ethiopic Object { year, month, date }
      const ethiopicCalendar = ge(gCMoment.year(), gCMoment.month() + 1, gCMoment.date());

      // Gregorian Calendar Format
      console.log(`${gCMoment.format('dddd, MMMM D')}`);
      // Ethiopic Calendar Format
      console.log(`${gregorianWeekdayToEthiopicWeekday(gCMoment.format('dddd'))}, ${ethiopicMonthToFullEthiopicMonth(ethiopicCalendar.month)} ${geezer(ethiopicCalendar.day)}`);

      // Filtering Edna movies...
      const ednaMallCells = $('.showtimes-movie-container').toArray().filter(container => $('.showtimes-movie-overview img[alt*="Edna Cinema"]', container).length > 0);

      ednaMallCells.forEach((ednaMallCell) => {
        // Full Poster URL
        console.log(`${config.URL_BASE}${$('.showtimes-movie-poster > a', ednaMallCell).attr('href').replace(/^\.\.\//, '')}`);
        // Movie Title ((2|3)D) removed and trimmed
        console.log($('.showtimes-movie-detail [class*="heading"]', ednaMallCell).text().replace(/\((2|3)D\)/g, '').trim());
      });

      // Date
      // $('ul.date-picker li a.date-area.date-selected').attr('href').match(/([0-9]{2})/g) - MM-DD-YY

      // Edna Movie Cell
      // $('.showtimes-movie-container .showtimes-movie-overview img[alt*="Edna Cinema"]')

      // /**
      //  * First h3 tag under section#main contains todays days in YYYY-MM-YY format
      //  * IF we get an array of length 3 the system is in accordance with our scrapper
      //  */
      // const [year, month, day] = $('body section#main header > h3 > strong')
      //   .text()
      //   .trim()
      //   .match(/\d{2,4}/g)
      //   .map(p => Number(p));
      // const gc = moment(`${year}-${month}-${day}`, 'YYYY-M-D');
      // const ec = ge(year, month, day);
      // const moviesDetail = Object.create(null); // this will hold movie detail pages...
      // const moviesTitle = Object.create(null); // this will hold movie titles...

      // const [c3, c2, c1] = $('body section#main header > div.row').toArray().map(cinema =>
      //   $('div.col-md-2', cinema).toArray().map((movie) => {
      //     const detail = `${config.URL_BASE}${$('a', movie).attr('href')}`;
      //     const title = $('a', movie).text().trim();
      //     const poster = $('img', movie).attr('src');

      //     moviesDetail[detail] = detail;
      //     moviesTitle[title] = title;

      //     return {
      //       title,
      //       poster,
      //       time: $('ul', movie).text().trim(),
      //       detail,
      //     };
      //   })
      // );

      // // going through details page and getting videos (if any)...
      // // $('iframe[src*="youtube"]') | ('iframe[src*="imdb"]')
      // const moviesDetailKeys = Object.keys(moviesDetail);
      // const moviesDetailKeysPromises = moviesDetailKeys.map(detail => detailCache(moedoo, detail));

      // Promise
      //   .all(moviesDetailKeysPromises)
      //   .then((moviesDetailKeysData) => {
      //     moviesDetailKeysData.forEach((moviesDetailKeyResponse, index) => {
      //       if (moviesDetailKeyResponse === null || typeof moviesDetailKeyResponse === 'string') {
      //         moviesDetail[moviesDetailKeys[index]] = moviesDetailKeyResponse;
      //       } else {
      //         const youtube = cheerio.load(moviesDetailKeyResponse.text)('iframe[src*="youtube"]');
      //         const imdb = cheerio.load(moviesDetailKeyResponse.text)('iframe[src*="imdb"]');
      //         moviesDetail[moviesDetailKeys[index]] = youtube.length > 0 ? youtube.attr('src') : null;
      //         // checking imdb embed if YouTube is not found...
      //         if (moviesDetail[moviesDetailKeys[index]] === null) {
      //           moviesDetail[moviesDetailKeys[index]] = imdb.length > 0 ? imdb.attr('src') : null;
      //         }

      //         detailCache(moedoo, moviesDetailKeys[index], moviesDetail[moviesDetailKeys[index]])
      //           .catch((err) => {
      //             console.error(err);
      //           });
      //       }
      //     });

      //     // hitting omdb to get synopsis...
      //     const moviesTitleKeys = Object.keys(moviesTitle);
      //     const moviesTitleKeysPromises = moviesTitleKeys.map(title => omdbCache(moedoo, title));

      //     Promise
      //       .all(moviesTitleKeysPromises)
      //       .then((moviesTitleKeysData) => {
      //         moviesTitleKeysData.forEach((moviesTitleKeyResponse, index) => {
      //           if (moviesTitleKeyResponse === null || Object.prototype.hasOwnProperty.call(moviesTitleKeyResponse, 'body') === false) {
      //             moviesTitle[moviesTitleKeys[index]] = moviesTitleKeyResponse;
      //           } else {
      //             if (moviesTitleKeyResponse.body.Response === 'False') {
      //               moviesTitle[moviesTitleKeys[index]] = null;
      //             } else if (
      //               moviesTitleKeyResponse.body.Title.toLocaleLowerCase() ===
      //               moviesTitle[moviesTitleKeys[index]].toLocaleLowerCase()
      //             ) {
      //               moviesTitle[moviesTitleKeys[index]] = moviesTitleKeyResponse.body;
      //             } else {
      //               moviesTitle[moviesTitleKeys[index]] = null;
      //             }

      //             omdbCache(moedoo, moviesTitleKeys[index], moviesTitle[moviesTitleKeys[index]])
      //               .catch((err) => {
      //                 console.error(err);
      //               });
      //           }
      //         });

      //         // filling details...
      //         // we'll be mutating (fix your face, yes, mutating) initial c3, c2 & c1...
      //         [c3, c2, c1].forEach((c) => {
      //           c.forEach((show, index) => {
      //             // eslint-disable-next-line
      //             c[index].video = moviesDetail[c[index].detail];
      //             // eslint-disable-next-line
      //             c[index].omdb = moviesTitle[c[index].title];
      //           });
      //         });

      //         resolve({
      //           show: { c3, c2, c1 },
      //           meta: {
      //             today: `${year}-${month}-${day}`, // YYYY-M-D
      //             gc: `${gc.format('dddd, MMMM D')}`, // dddd, MMMM D
      //             ec: `${gregorianWeekdayToEthiopicWeekday(gc.format('dddd'))}, ${ethiopicMonthToFullEthiopicMonth(ec.month)} ${geezer(ec.day)}`, // dddd, MMMM D
      //           },
      //         });
      //       })
      //       .catch((err) => {
      //         reject(err);
      //       });
      //   });
    })
    .catch((err) => {
      reject(err);
    });
});

(function () {
  'use strict';

  var scraperjs = require('scraperjs'),
      moment = require('moment'),
      _ = require('underscore'),
      async = require('async'),
      omdb = require('omdb'),
      moviedb = require('moviedb')('48df93058dac28a5cd63ee254fd1ca42'),
      fixHumanError = require('./fixHumanError.js');

  /**
   * given a text of a td, cleans it up using some regX magic and returns
   * pretty version
   *
   * @param {String} text
   * @returns {String}
   */
  function cleanUpText (text) {
    text = text.trim().toUpperCase();
    text = text.replace(/[\f\n\r\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]/g, ' ');
    while (text.search(/(  )/) > -1) {
      text = text.replace(/(  )/g, ' ');
    }

    return text;
  }

  /**
   * given a cleaned up text, returns a yet a prettier version (date hence `D`)
   * PS: the function is in no way to be vulgar
   *
   * @param {String} text
   * @returns {String} - `dddd MMM D, YYYY`
   */
  function cleanD (text) {
    text = text.replace(/( ?, ?)/g, ', ');
    // yes apparently, we're a year behind!
    text = text.replace(/\d{4}/g, moment().format('YYYY'));
    return moment(text.substring(0, (text.search(/\d{4}/) + 4)), 'dddd MMM D, YYYY').format('X');
  }

  // the following two "closure" are used to somewhat "cache" our
  // super-efficient ;) scrapper
  var showtime = {
        cinemaOne: {},
        cinemaTwo: {},
        cinemaThree: {}
      },
      lastScraped = moment().subtract(3, 'days'),
      omdbCache = {"": null}, // making sure we don't abuse the API call
      freshAge = 30; // age where scrape data is considered fresh - (minutes)

  module.exports = function (callback) {
    if (moment(lastScraped).add(freshAge, 'minutes').isBefore(moment())) {
      scraperjs.StaticScraper
        .create('http://ednamall.info/show_time.html')
        .scrape(function ($) {
          /**
           * we're going to make a BOLD / smart assumption that query selector
           * `table#timetable > tbody > tr > td` is going to return 280 td nodes
           *
           * i highly doubt that `they` are EVER (like in infinity years) going
           * to change the count seeing how the "code" is written, but if that
           * day ever comes am going to have my work cut out for moi :)
           *
           * PS: obviously seeing how the "styling" is applied on the "page"
           * relying on class name / id is like relying on <insert racist joke here>
           */

          // <td> date container list
          var td = $('table#timetable > tbody > tr > td'),
              dayRunner = [cleanD(cleanUpText($(td[0]).text())),    // Friday
                           cleanD(cleanUpText($(td[40]).text())),   // Saturday
                           cleanD(cleanUpText($(td[80]).text())),   // Sunday
                           cleanD(cleanUpText($(td[120]).text())),  // Monday
                           cleanD(cleanUpText($(td[160]).text())),  // Tuesday
                           cleanD(cleanUpText($(td[200]).text())),  // Wednesday
                           cleanD(cleanUpText($(td[240]).text()))], // Thursday
              cinemaFactor = 0,
              cinemaOneFactor = 10,
              cinemaTwoFactor = 12,
              cinemaThreeFactor = 14,
              callCounter = 0;

          // 7 days (dayRunner)
          async.eachSeries([0, 1, 2, 3, 4, 5, 6], function (dindex, dcallback) {
            cinemaFactor = dindex * 40;
            showtime.cinemaOne[dayRunner[dindex]] = [];
            showtime.cinemaTwo[dayRunner[dindex]] = [];
            showtime.cinemaThree[dayRunner[dindex]] = [];

            // 5 movies / day in each cinema
            async.eachSeries([0, 1, 2, 3, 4], function (i, ecallback) {
              var iCONSTANT = cinemaFactor + (i * 6),
                  showtimeCinemaOne = cleanUpText($(td[iCONSTANT + cinemaOneFactor]).text()),
                  showtimeCinemaTwo = cleanUpText($(td[iCONSTANT + cinemaTwoFactor]).text()),
                  showtimeCinemaThree = cleanUpText($(td[iCONSTANT + cinemaThreeFactor]).text()),
                  movieCinemaOne = fixHumanError(cleanUpText($(td[iCONSTANT + cinemaOneFactor + 1]).text())),
                  movieCinemaTwo = fixHumanError(cleanUpText($(td[iCONSTANT + cinemaTwoFactor + 1]).text())),
                  movieCinemaThree = fixHumanError(cleanUpText($(td[iCONSTANT + cinemaThreeFactor + 1]).text()));

              async.parallel([
                function (pcallback) {
                  if (omdbCache.hasOwnProperty(movieCinemaOne) === false) {
                    omdb.get({
                      title: movieCinemaOne,
                      type: 'movie'
                    }, true, function (error, movieInfo) {
                      if (error === null && movieInfo !== null) {
                        // poster link returned from omdb is of IMDB's, which isn't allowed
                        // this is where 'themoviedb.org' comes to the rescue
                        moviedb.searchMovie({query: movieCinemaOne}, function (mdbError, mdbResults) {
                          if (mdbError === null && mdbResults.total_results > 0) {
                            if (mdbResults.results[0].title.toUpperCase() === movieCinemaOne) {
                              movieInfo.savedOn = moment();
                              movieInfo.poster = 'http://image.tmdb.org/t/p/w185'+ mdbResults.results[0].poster_path;
                              omdbCache[movieCinemaOne] = movieInfo;
                              pcallback(null, movieInfo);
                            }
                          }
                        });
                      } else {
                        omdbCache[movieCinemaOne] = null;
                        pcallback(null, null);
                      }
                    });
                  } else {
                    pcallback(null, omdbCache[movieCinemaOne]);
                  }
                },

                function (pcallback) {
                  if (omdbCache.hasOwnProperty(movieCinemaTwo) === false) {
                    omdb.get({
                      title: movieCinemaTwo,
                      type: 'movie'
                    }, true, function (error, movieInfo) {
                      if (error === null && movieInfo !== null) {
                        moviedb.searchMovie({query: movieCinemaTwo}, function (mdbError, mdbResults) {
                          if (mdbError === null && mdbResults.total_results > 0) {
                            if (mdbResults.results[0].title.toUpperCase() === movieCinemaTwo) {
                              movieInfo.savedOn = moment();
                              movieInfo.poster = 'http://image.tmdb.org/t/p/w185'+ mdbResults.results[0].poster_path;
                              omdbCache[movieCinemaTwo] = movieInfo;
                              pcallback(null, movieInfo);
                            }
                          }
                        });
                      } else {
                        omdbCache[movieCinemaTwo] = null;
                        pcallback(null, null);
                      }
                    });
                  } else {
                    pcallback(null, omdbCache[movieCinemaTwo]);
                  }
                },

                function (pcallback) {
                  if (omdbCache.hasOwnProperty(movieCinemaThree) === false) {
                    omdb.get({
                      title: movieCinemaThree,
                      type: 'movie'
                    }, true, function (error, movieInfo) {
                      if (error === null && movieInfo !== null) {
                        moviedb.searchMovie({query: movieCinemaThree}, function (mdbError, mdbResults) {
                          if (mdbError === null && mdbResults.total_results > 0) {
                            if (mdbResults.results[0].title.toUpperCase() === movieCinemaThree) {
                              movieInfo.savedOn = moment();
                              movieInfo.poster = 'http://image.tmdb.org/t/p/w185'+ mdbResults.results[0].poster_path;
                              omdbCache[movieCinemaThree] = movieInfo;
                              pcallback(null, movieInfo);
                            }
                          }
                        });
                      } else {
                        omdbCache[movieCinemaThree] = null;
                        pcallback(null, null);
                      }
                    });
                  } else {
                    pcallback(null, omdbCache[movieCinemaThree]);
                  }
                }
              ], function (error, results) {
                showtime.cinemaOne[dayRunner[dindex]].push({
                  'showtime': showtimeCinemaOne,
                  'movie': movieCinemaOne,
                  'info': results[0]
                });

                showtime.cinemaTwo[dayRunner[dindex]].push({
                  'showtime': showtimeCinemaTwo,
                  'movie': movieCinemaTwo,
                  'info': results[1]
                });

                showtime.cinemaThree[dayRunner[dindex]].push({
                  'showtime': showtimeCinemaThree,
                  'movie': movieCinemaThree,
                  'info': results[2]
                });

                ecallback(null);
              });
            }, function (error) {
              dcallback(null);
            });
          }, function (error) {
            lastScraped = moment();
            callback(showtime);
          });
        });
    } else {
      callback(showtime);
    }
  };

})();

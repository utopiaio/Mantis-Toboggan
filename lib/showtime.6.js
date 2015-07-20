import scraper from 'scraperjs';
import async from 'async';
import omdb from 'omdb';
import moviedb from 'moviedb';
import fixHumanError from './fixHumanError';



let moviedbAPI = moviedb('48df93058dac28a5cd63ee254fd1ca42');
let MovieMap = new Map();



/**
 * given a text of a td, cleans it up using some regX magic and returns pretty version
 *
 * @param {String} text
 * @returns {String}
 */
function cleanupTd(text) {
  text = text.trim().toUpperCase();
  text = text.replace(/[\f\n\r\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]/g, ' ');
  while(text.search(/(  )/) > -1) {
    text = text.replace(/(  )/g, ' ');
  }
  text = text.replace(/ *- */g, '-').replace(/-/g, ' - ');
  text = text.replace(/\( +/, '(').replace(/ +\)/, ')');

  return text;
}



/**
 * given movie showtime, it'll return a a "valid" format
 *
 * @param {String} time
 * returns {Object}
 */
function clanupTime(time) {
  time = time.replace(/(\d{2}) *: *(\d{2}) *([A|P]M)/g, '$1:$2 $3');
  let timeSplit = time.split(' - ');

  return timeSplit.length === 2 ? {start: timeSplit[0], end: timeSplit[1]} : time;
}



/**
 * given movie title, it'll clan it up
 *
 * @param {String} title
 * returns {Object}
 */
function clanupMovie(title) {
  if(title === '') {
    return null;
  }

  else if(title.search(/\(3D\)/i) > -1) {
    title = fixHumanError(title.replace(/\(3D\)/gi, '').trim());
    return {'3D': true, title};
  }

  else {
    title = fixHumanError(title);
    return {'3D': false, title};
  }
}



/**
 * gets the movie info, and returns an altered object with info
 *
 * @param {Object} movie
 */
function getMovieInfo(movie) {
  return new Promise((resolve, reject) => {
    if(movie === null) {
      resolve(movie);
    }

    else {
      if(MovieMap.has(movie.title) === true) {
        resolve(MovieMap.get(movie.title));
      }

      else {
        omdb.get({
          title: movie.title,
          type: 'movie'
        }, true, (error, movieInfo) => {
          if(error === null && movieInfo !== null) {
            // poster link returned from omdb is of IMDB's, which isn't allowed
            // this is where 'themoviedb.org' comes to the rescue
            moviedbAPI.searchMovie({query: movie.title}, (mdbError, mdbResults) => {
              if(mdbError === null && mdbResults.total_results > 0 && (mdbResults.results[0].title.toUpperCase() === movie.title)) {
                movieInfo.poster = {
                  small: 'http://image.tmdb.org/t/p/w92'+ mdbResults.results[0].poster_path,
                  medium: 'http://image.tmdb.org/t/p/w185'+ mdbResults.results[0].poster_path,
                  large: 'http://image.tmdb.org/t/p/w780'+ mdbResults.results[0].poster_path
                };
                MovieMap.set(movie.title, movieInfo);
                resolve(movieInfo);
              }

              else {
                MovieMap.set(movie.title, null);
                resolve(null);
              }
            });
          }

          else {
            MovieMap.set(movie.title, null);
            resolve(null);
          }
        });
      }
    }
  });
}



export default () => {
  return new Promise((resolve, reject) => {
    scraper
      .StaticScraper
      .create('http://ednamall.info/show_time.html')
      .scrape(($) => {
        let td = $('table#timetable > tbody > tr > td');

        let showtime = {
          'Friday': {'C1': [], 'C2': [], 'C3': []},
          'Saturday': {'C1': [], 'C2': [], 'C3': []},
          'Sunday': {'C1': [], 'C2': [], 'C3': []},
          'Monday': {'C1': [], 'C2': [], 'C3': []},
          'Tuesday': {'C1': [], 'C2': [], 'C3': []},
          'Wednesday': {'C1': [], 'C2': [], 'C3': []},
          'Thursday': {'C1': [], 'C2': [], 'C3': []}
        };

        let dayRunner = {
          'Friday': 10,
          'Saturday': 50,
          'Sunday': 90,
          'Monday': 130,
          'Tuesday': 170,
          'Wednesday': 210,
          'Thursday': 250
        };

        async.forEachOfSeries(dayRunner, (dayValue, dayKey, dayCallback) => {
          // 5 movies / day in each cinema
          async.eachSeries([0, 1, 2, 3, 4], (movie, movieCallback) => {
            let cinema1Index = dayValue + (movie * 6),
                cinema2Index = dayValue + (movie * 6) + 2,
                cinema3Index = dayValue + (movie * 6) + 4;

            let cinema1Showtime = clanupTime(cleanupTd($(td[cinema1Index]).text())),
                cinema2Showtime = clanupTime(cleanupTd($(td[cinema2Index]).text())),
                cinema3Showtime = clanupTime(cleanupTd($(td[cinema3Index]).text()));

            let cinema1Movie = clanupMovie(cleanupTd($(td[cinema1Index + 1]).text())),
                cinema2Movie = clanupMovie(cleanupTd($(td[cinema2Index + 1]).text())),
                cinema3Movie = clanupMovie(cleanupTd($(td[cinema3Index + 1]).text()));

            getMovieInfo(cinema1Movie).then((info1) => {
              cinema1Movie.info = info1;
              showtime[dayKey]['C1'].push({time: cinema1Showtime, movie: cinema1Movie});

              getMovieInfo(cinema2Movie).then((info2) => {
                cinema2Movie.info = info2;
                showtime[dayKey]['C2'].push({time: cinema2Showtime, movie: cinema2Movie});

                getMovieInfo(cinema3Movie).then((info3) => {
                  cinema3Movie.info = info3;
                  showtime[dayKey]['C3'].push({time: cinema3Showtime, movie: cinema3Movie});

                  movieCallback(null);
                }, (error3) => {
                  cinema3Movie.info = null;
                  showtime[dayKey]['C3'].push({time: cinema3Showtime, movie: cinema3Movie});
                });
              }, (error2) => {
                cinema2Movie.info = null;
                showtime[dayKey]['C2'].push({time: cinema2Showtime, movie: cinema2Movie});
              });
            }, (error1) => {
              cinema1Movie.info = null;
              showtime[dayKey]['C1'].push({time: cinema1Showtime, movie: cinema1Movie});
            });
          }, (movieError) => {
            dayCallback(movieError);
          });
        }, (dayRunnerError) => {
          dayRunnerError === null ? resolve(showtime) : reject(dayRunnerError);
        });
      });
  });
};

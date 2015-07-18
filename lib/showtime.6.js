import scraper from 'scraperjs';
import moment from 'moment';
import async from 'async';
import omdb from 'omdb';
import moviedb from 'moviedb';



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
    return {'3D': true, title: title.replace(/\(3D\)/gi, '').trim()};
  }

  else {
    return {'3D': false, title: title};
  }
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

        async.forEachOf(dayRunner, (dayValue, dayKey, dayCallback) => {
          // 5 movies / day in each cinema
          async.each([0, 1, 2, 3, 4], (movie, movieCallback) => {
            let cinema1Index = dayValue + (movie * 6),
                cinema2Index = dayValue + (movie * 6) + 2,
                cinema3Index = dayValue + (movie * 6) + 4;

            let cinema1Showtime = clanupTime(cleanupTd($(td[cinema1Index]).text())),
                cinema2Showtime = clanupTime(cleanupTd($(td[cinema2Index]).text())),
                cinema3Showtime = clanupTime(cleanupTd($(td[cinema3Index]).text()));

            let cinema1Movie = clanupMovie(cleanupTd($(td[cinema1Index + 1]).text())),
                cinema2Movie = clanupMovie(cleanupTd($(td[cinema2Index + 1]).text())),
                cinema3Movie = clanupMovie(cleanupTd($(td[cinema3Index + 1]).text()));

            showtime[dayKey]['C1'].push({time: cinema1Showtime, movie: cinema1Movie});
            showtime[dayKey]['C2'].push({time: cinema2Showtime, movie: cinema2Movie});
            showtime[dayKey]['C3'].push({time: cinema3Showtime, movie: cinema3Movie});
            movieCallback(null);
          }, (movieError) => {
            dayCallback(movieError);
          });
        }, (dayRunnerError) => {
          dayRunnerError === null ? resolve(showtime) : reject(dayRunnerError);
        });
      });
  });
};

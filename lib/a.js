const moment = require('moment');
const geezer = require('geezer');
const { ge } = require('ethiopic-calendar');

const lw5Cache = require('./lw5Cache');
const schedule = require('./../schedule');
const { gregorianWeekdayToEthiopicWeekday, ethiopicMonthToFullEthiopicMonth } = require('./ec');

module.exports = moedoo => () => new Promise((resolve, reject) => {
  const todayYYYYMMDD = moment().format('YYYY-MM-DD');

  // no show update for today...
  if (Object.prototype.hasOwnProperty.call(schedule, todayYYYYMMDD) === false) {
    reject('¯\\_(ツ)_/¯');
    return;
  }

  // Gregorian Calendar Moment
  const gCMoment = moment();
  // Ethiopic Object { year, month, date }
  const ethiopicCalendar = ge(gCMoment.year(), gCMoment.month() + 1, gCMoment.date());
  const movies = {}; // { title, indices }

  [1, 2, 3].forEach((cinemaNumber) => {
    schedule[todayYYYYMMDD][`c${cinemaNumber}`].forEach((movie, index) => {
      if (Object.prototype.hasOwnProperty.call(movies, movie.title) === true) {
        movies[movie.title].push({
          cinema: `c${cinemaNumber}`,
          index,
        });
      } else {
        movies[movie.title] = [
          {
            cinema: `c${cinemaNumber}`,
            index,
          },
        ];
      }
    });
  });

  // to be used on lw5 Promise...
  const lw5Mapper = Object.keys(movies).map(movieTitle => ({
    title: movieTitle,
    indices: movies[movieTitle],
  }));

  // build lw5 promise for each movie...
  const lw5MapperPromises = lw5Mapper.map(lw5 => lw5Cache(moedoo, lw5.title));

  Promise
    .all(lw5MapperPromises)
    .then((lw5Data) => {
      lw5Data.forEach((lw5Response, index) => {
        if (lw5Response !== null) {
          // updating movie detail...
          lw5Mapper[index].indices.forEach((lw5MapIndex) => {
            schedule[lw5MapIndex.cinema][lw5MapIndex.index].title = lw5Response.name;
            schedule[lw5MapIndex.cinema][lw5MapIndex.index].detail = lw5Response;
            schedule[lw5MapIndex.cinema][lw5MapIndex.index].posterURL = lw5Response.poster;
          });
        }
      });

      resolve({
        show: schedule,
        meta: {
          gc: `${gCMoment.format('dddd, MMMM D')}`,
          ec: `${gregorianWeekdayToEthiopicWeekday(gCMoment.format('dddd'))}, ${ethiopicMonthToFullEthiopicMonth(ethiopicCalendar.month)} ${geezer(ethiopicCalendar.day)}`,
        },
      });
    }, () => {
      // resolving with all null detail
      resolve({
        show: schedule,
        meta: {
          gc: `${gCMoment.format('dddd, MMMM D')}`,
          ec: `${gregorianWeekdayToEthiopicWeekday(gCMoment.format('dddd'))}, ${ethiopicMonthToFullEthiopicMonth(ethiopicCalendar.month)} ${geezer(ethiopicCalendar.day)}`,
        },
      });
    });
});

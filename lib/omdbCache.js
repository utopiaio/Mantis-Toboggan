const cheerio = require('cheerio');
const request = require('superagent');

const date = new Date();

const imdb = imdbID => new Promise((resolve, reject) => {
  request
    .get(`http://www.imdb.com/title/${imdbID}/`)
    .then((res) => {
      // loading the body in cheerio...
      const $ = cheerio.load(res.text);
      const videoID = $('.slate_wrapper a[data-video]').attr('data-video');

      if (videoID === undefined) {
        // no video id at all
        reject();
      } else {
        request(`http://www.imdb.com/video/imdb/${videoID}/imdb/embed`)
          .then((videoResponse) => {
            const $video = cheerio.load(videoResponse.text);

            try {
              const videoObject = JSON.parse($video('script.imdb-player-data').text());

              // eslint-disable-next-line
              if (videoObject.videoPlayerObject && videoObject.videoPlayerObject.video && videoObject.videoPlayerObject.video.videoInfoList) {
                const video = videoObject.videoPlayerObject.video.videoInfoList.filter(v => v.videoMimeType === 'video/mp4');

                if (video.length === 1) {
                  // we have video 🎉
                  resolve(video[0].videoUrl);
                } else {
                  // no supported video :(
                  reject();
                }
              } else {
                // structure change, undefined test fail? 🤔
                reject();
              }
            } catch (err) {
              // JSON parse failed
              reject(err);
            }
          }, (err) => {
            // request failed
            reject(err);
          });
      }
    }, (err) => {
      reject(err);
    });
});

/**
 * checks for cache in our showtime omdb db
 *
 * @param  {Object} moedoo
 * @param  {String} title
 * @param  {Object} detail
 * @return {Promise}
 */
const omdbCache = (moedoo, title = '', detail) => new Promise((resolve, reject) => {
  if (detail === undefined) {
    moedoo
      .query('SELECT detail FROM omdb WHERE title = $1;', [title])
      .then((result) => {
        if (result.length === 1) {
          resolve(result[0].detail);
        } else {
          // running omdb on previous and current year
          Promise.all([
            request('GET', `https://omdbapi.com/?t=${encodeURI(decodeURI(title))}&tomatoes=true&y=${date.getFullYear() - 1}`),
            request('GET', `https://omdbapi.com/?t=${encodeURI(decodeURI(title))}&tomatoes=true&y=${date.getFullYear()}`),
          ]).then((response) => {
            const [previousYear, currentYear] = response;

            if (Object.prototype.hasOwnProperty.call(currentYear, 'body') && currentYear.body.Response === 'True') {
              imdb(currentYear.body.imdbID).then((video) => {
                // self-cache with video...
                // eslint-disable-next-line
                omdbCache(moedoo, title, Object.assign({}, currentYear.body, { video })).then(() => {}, () => {});
                resolve(Object.assign({}, currentYear.body, { video }));
              }, () => {
                // self-cache with no video...
                // eslint-disable-next-line
                omdbCache(moedoo, title, Object.assign({}, currentYear.body, { video: null })).then(() => {}, () => {});
                resolve(Object.assign({}, currentYear.body, { video: null }));
              });
            } else if (Object.prototype.hasOwnProperty.call(previousYear, 'body') && previousYear.body.Response === 'True') {
              imdb(previousYear.body.imdbID).then((video) => {
                // self-cache with video...
                // eslint-disable-next-line
                omdbCache(moedoo, title, Object.assign({}, currentYear.body, { video })).then(() => {}, () => {});
                resolve(Object.assign({}, previousYear.body, { video }));
              }, () => {
                // self-cache with no video...
                // eslint-disable-next-line
                omdbCache(moedoo, title, Object.assign({}, currentYear.body, { video: null })).then(() => {}, () => {});
                resolve(Object.assign({}, previousYear.body, { video: null }));
              });
            } else {
              // self-cache with no movie detail (movie not found in both years)...
              omdbCache(moedoo, title, null).then(() => {}, () => {});
              resolve(null);
            }
          }, () => {
            // self-cache with no movie detail (promise fail)...
            omdbCache(moedoo, title, null).then(() => {}, () => {});
            resolve(null);
          });
        }
      });
  } else {
    moedoo
      .query('INSERT INTO omdb (title, detail) VALUES ($1, $2) returning detail;', [title, detail])
      .then((result) => {
        resolve(result[0].detail);
      }, (err) => {
        reject(err);
      });
  }
});

module.exports = omdbCache;

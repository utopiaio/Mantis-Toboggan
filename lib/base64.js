const request = require('superagent');

module.exports = url => new Promise((resolve, reject) => {
  request
    .get(url)
    .then((response) => {
      const buffer = new Buffer(response.body, 'binary');
      resolve(`data:${response.header['content-type']};base64,${buffer.toString('base64')}`);
    })
    .catch((err) => {
      reject(err);
    });
});

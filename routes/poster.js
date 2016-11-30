const posterCache = require('./../lib/posterCache');

module.exports = moedoo => (request, response) => {
  if (Object.prototype.hasOwnProperty.call(request.query, 'url')) {
    posterCache(moedoo, request.query.url)
      .then((base64) => {
        response.set('Content-Type', 'text/plain').status(200).send(base64).end();
      })
      .catch((error) => {
        response.status(503).json(error).end();
      });
  } else {
    response.status(400).end();
  }
};

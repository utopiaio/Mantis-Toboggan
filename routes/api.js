const a = require('./../lib/a');

module.exports = (moedoo) => {
  const am = a(moedoo);

  return (request, response) => {
    am()
      .then((info) => {
        response.status(200).json(info).end();
      }, (err) => {
        if (err === '¯\\_(ツ)_/¯') {
          response.status(418).end();
        } else {
          response.status(503).json(err).end();
        }
      });
  };
};

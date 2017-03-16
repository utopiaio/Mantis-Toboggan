const a = require('./../lib/a');

module.exports = (moedoo) => {
  const am = a(moedoo);

  return (request, response) => {
    am()
      .then((info) => {
        response.status(200).json(info).end();
      }, (err) => {
        response.status(503).json(err).end();
      });
  };
};

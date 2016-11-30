const a = require('./../lib/a');

module.exports = (moedoo) => {
  const am = a(moedoo);

  return (request, response) => {
    am()
      .then((info) => {
        response.status(200).json(info).end();
      })
      .catch((error) => {
        response.status(503).json(error).end();
      });
  };
};

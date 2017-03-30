const a = require('./../lib/a');

module.exports = (moedoo) => {
  const am = a(moedoo);

  return (request, response) => {
    am()
      .then((info) => {
        response.status(200).json(info).end();
      }, () => {
        response.status(418).end();
      });
  };
};

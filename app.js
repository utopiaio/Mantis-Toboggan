/* eslint no-console: 0 */

const http = require('http');
const express = require('express');
const compression = require('compression');

const config = require('./config');
const a = require('./lib/a');
const moedoo = require('./lib/moedoo')({
  DB_USER: config.DB_USER,
  DB_PASSWORD: config.DB_PASSWORD,
  DB_HOST: config.DB_HOST,
  DB_PORT: config.DB_PORT,
  DB_NAME: config.DB_NAME,
});

const app = express();
app.set('port', process.env.PORT || config.APP_PORT);
app.use(compression());

// API...
app.get('/api', (request, response) => {
  a().then((info) => {
    response.status(200).json(info).end();
  });
});

// fall-back handler...
app.all('*', (request, response) => {
  response.status(400).end();
});

const server = http.createServer(app); // creating server which express will piggy back on
server.listen(app.get('port'), config.APP_HOST, () => {
  console.log(`Server running on ${config.APP_HOST}:${config.APP_PORT}...`);
});

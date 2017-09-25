/* eslint no-console: 0 */

const http = require('http');
const express = require('express');
const compression = require('compression');
const moment = require('moment');

const config = require('./config');
const moedoo = require('./lib/moedoo')(process.env.DATABASE_URL || {
  DB_USER: config.DB_USER,
  DB_PASSWORD: config.DB_PASSWORD,
  DB_HOST: config.DB_HOST,
  DB_PORT: config.DB_PORT,
  DB_NAME: config.DB_NAME,
});

const api = require('./routes/api');
const poster = require('./routes/poster');

moedoo.query(`
  CREATE TABLE IF NOT EXISTS rtdb(
    title character varying(128) NOT NULL,
    detail jsonb,
    created_at Date DEFAULT now(),
    CONSTRAINT movie_pk PRIMARY KEY (title)
  );

  CREATE TABLE IF NOT EXISTS poster(
    url character varying(1024) NOT NULL,
    poster text,
    created_at Date DEFAULT now(),
    CONSTRAINT poster_pk PRIMARY KEY (url)
  );

  -- the following two can be one
  DELETE FROM rtdb WHERE created_at < '${moment().subtract(5, 'days').format('YYYY-MM-DD')}';
  DELETE FROM poster WHERE created_at < '${moment().subtract(30, 'days').format('YYYY-MM-DD')}';`).then(() => {
  const app = express();
  app.set('port', process.env.PORT || config.APP_PORT);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    next();
  });

  app.use(compression());

  // API...
  app.get('/api', api(moedoo));

  // Poster...
  app.get('/poster', poster(moedoo));

  // fall-back handler...
  app.all('*', (request, response) => {
    response.status(400).end();
  });

  const server = http.createServer(app); // creating server which express will piggy back on
  server.listen(app.get('port'), config.APP_HOST, () => {
    console.log(`Server running on ${config.APP_HOST}:${process.env.PORT || config.APP_PORT}...`);
  });
}, (err) => {
  console.error(err);
});

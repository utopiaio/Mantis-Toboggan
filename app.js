/* eslint no-console: 0 */

const http = require('http');
const express = require('express');
const compression = require('compression');

const config = require('./config');
const moedoo = require('./lib/moedoo')(process.env.DATABASE_URL || {
  DB_USER: config.DB_USER,
  DB_PASSWORD: config.DB_PASSWORD,
  DB_HOST: config.DB_HOST,
  DB_PORT: config.DB_PORT,
  DB_NAME: config.DB_NAME,
});
const a = require('./lib/a')(moedoo);

moedoo.query(`
  CREATE TABLE IF NOT EXISTS detail(
    detail character varying(1024) NOT NULL,
    video character varying(1024),
    CONSTRAINT detail_pk PRIMARY KEY (detail)
  );

  CREATE TABLE IF NOT EXISTS omdb(
    title character varying(128) NOT NULL,
    detail jsonb,
    CONSTRAINT movie_pk PRIMARY KEY (title)
  );`).then(() => {
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
  })
  .catch((err) => {
    console.error(err);
  });

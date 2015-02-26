(function () {
  'use strict';

  var http = require('http'),
      path = require('path'),
      connect = require('connect'),
      express = require('express'),
      compression = require('compression'),
      serveFavicon = require('serve-favicon');

  var showtime = require('./lib/showtime');

  var app = express();
  app.set('port', process.env.PORT || 8000);
  app.use(compression());
  app.use('/app\.cache$', function (request, response, next) {
    // response.status(404).end();
    response.setHeader('Content-Type', 'text/cache-manifest');
    next();
  });
  app.use(serveFavicon(path.join(__dirname, 'public/assets/images/favicon.ico')));
  app.use(express.static(path.join(__dirname, '/public')));

  app.use('/showtime', function (request, response, next) {
    if (request.method === 'GET') {
      showtime(function (itsShowtime) {
        response.status(200);
        response.json(itsShowtime);
      });
    } else {
      response.status(405).end();
    }
  });

  // this makes sure angular is in-charge of routing
  app.use(function (request, response) {
    response.sendFile(path.join(__dirname, '/public/index.html'));
  });

  var server = http.createServer(app);
  server.listen(app.get('port'));
})();

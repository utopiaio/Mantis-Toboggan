;(function() {
  'use strict';

  var express = require('express');
  var compression = require('compression');
  var showtime = require('./lib/showtime.6.babel.js');

  var app = express();
  app.set('port', process.env.PORT || 8000);
  app.use(compression());
  app.get('/', function(request, response, next) {
    showtime().then(function(data) {
      response.status(200);
      response.json(data);
    }, function(error) {
      response.status(503);
      response.json({error: error});
    });
  });

  app.listen(app.get('port'), function() {
    console.log('server running on port ['+ app.get('port') +']...');
  });
})();

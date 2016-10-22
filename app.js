/* eslint no-console: 0 */

const express = require('express');
const compression = require('compression');

const app = express();
app.set('port', process.env.PORT || 8000);
app.use(compression());

// API
app.get('/api', (request, response) => {
  response.status(200).end();
});

// fall-back handler...
app.all('*', (request, response) => {
  response.status(400).end();
});

app.listen(app.get('port'), () => {
  console.log(`server running on port ${app.get('port')}...`);
});

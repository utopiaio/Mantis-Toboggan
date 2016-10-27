/* eslint no-console:0 */
import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';

import history from './history';

import Showtime from './../component/Showtime.jsx';
import Rick from './../component/Rick.jsx';
import Cinema from './../component/Cinema.jsx';
import Movie from './../component/Movie.jsx';
import Setting from './../component/Setting.jsx';

const routes = (
  <Router history={history}>
    <Route path="/" component={Showtime}>
      <IndexRoute component={Rick} />
      <Route path="/show/:cinema" component={Cinema}>
        <Route path="/show/:cinema/:movie" component={Movie} />
      </Route>
      <Route path="/setting" component={Setting} />
      <Route path="*" component={Rick} />
    </Route>
  </Router>
);

module.exports = routes;

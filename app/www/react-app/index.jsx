/* global window, document */

import React from 'react';
import { render } from 'react-dom';

import routes from './config/routes.jsx';

import 'normalize.css/normalize.css';
import './static/font/iconmoon/style.css';

import './less/app.less';

// window.document.addEventListener('deviceready', () => {
render(routes, document.getElementById('app'));
// }, false);


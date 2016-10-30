/* global document */

import React from 'react';
import { render } from 'react-dom';

import routes from './config/routes.jsx';

import 'normalize.css/normalize.css';
import './static/font/iconmoon/style.css';

import './less/app.less';

render(routes, document.getElementById('app'));

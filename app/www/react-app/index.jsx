/* global document */

import React from 'react';
import { render } from 'react-dom';
import Showtime from './component/Showtime.jsx';

import 'normalize.css/normalize.css';
import './static/font/iconmoon/style.css';
import './less/app.less';

render(<Showtime />, document.getElementById('app'));

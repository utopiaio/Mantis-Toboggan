/* global document */

import React from 'react';
import { render } from 'react-dom';
import Showtime from './component/Showtime.jsx';

import './less/app.less';

render(<Showtime />, document.getElementById('app'));

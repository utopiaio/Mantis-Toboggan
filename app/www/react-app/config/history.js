import { useRouterHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';

const history = useRouterHistory(createHashHistory)();

module.exports = history;

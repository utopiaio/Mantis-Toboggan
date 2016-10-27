import { useRouterHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';

const history = useRouterHistory(createHashHistory)({
  queryKey: false,
});

module.exports = history;

import { SHOWTIME, POSTER, LANGUAGE, THEME, LOADING, MOVIE } from './../constant/showtime';

function showtime(state = {
  showtime: {
    show: {
      c3: [],
      c2: [],
      c1: [],
    },
    meta: {
      today: '1991-9-8',
      ec: '1991-9-8',
      gc: '1991-9-8',
    },
  },
  poster: Object.create(null),
  movie: null,
  language: 'en',
  theme: 'night',
  loading: false,
}, action) {
  switch (action.type) {
    case SHOWTIME:
      return Object.assign({}, state, { showtime: action.showtime });

    case MOVIE:
      return Object.assign({}, state, { movie: action.movie });

    case POSTER:
      return Object.assign({}, state, { poster: action.poster });

    case LANGUAGE:
      return Object.assign({}, state, { language: action.language });

    case THEME:
      return Object.assign({}, state, { theme: action.theme });

    case LOADING:
      return Object.assign({}, state, { loading: action.loading });

    default:
      return state;
  }
}

module.exports = showtime;

import { SHOWTIME, POSTER, LANGUAGE, THEME, LOADING } from './../constant/showtime';

function showtime(state = {
  showtime: Object.create(null),
  poster: Object.create(null),
  language: 'en',
  theme: 'night',
  loading: false,
}, action) {
  switch (action.type) {
    case SHOWTIME:
      return Object.assign({}, state, { showtime: action.showtime });

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

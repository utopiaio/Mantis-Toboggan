/* eslint no-confusing-arrow: 0 */

/**
 * a util to be used to add `_am_` or not
 * @param  {String} language
 * @return {String}
 */

module.exports = language => language === 'am' ? '_am_' : '';

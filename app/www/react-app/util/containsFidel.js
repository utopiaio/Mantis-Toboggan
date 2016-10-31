/**
 * given a word checks weather or not it contains a Fidel or not
 */

module.exports = (word = '') => /[\u1200-\u137C]/.test(word);

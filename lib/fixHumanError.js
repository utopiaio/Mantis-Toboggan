(function () {
  'use strict';

  /**
   * Object `structure`
   * 'WRONG MOVIE TITLE': 'CORRECT MOVIE TITLE'
   */
  var fixIt = {
    'KINGSMAN': 'KINGSMAN: THE SECRET SERVICE',
    'RUN ALL NIGHTL': 'RUN ALL NIGHT',
    'HOME (3D)': 'HOME',
    'HOME(3D)': 'HOME'
  };

  /**
   * well nothing fixes human error better than another human
   * seems the "maintainers" avoid long title movies since it would mess up
   * their amazing table. so this is where we apply fixes on movie title
   * this has to be MANUALLY!
   * i, yours truly will "maintain" it so you can ENJOY!
   *
   * @param {String} title - movie title
   * @returns {String} - the appropriate movie title so the APIs know
   */
  module.exports = function (title) {
    return fixIt.hasOwnProperty(title) === true ? fixIt[title] : title;
  };
})();

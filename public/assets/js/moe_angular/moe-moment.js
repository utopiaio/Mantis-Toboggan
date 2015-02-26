(function (angular) {
  'use strict';

  angular.module('moeMoment', [])
    .filter('moment', function () {
      return function (input, format) {
        if (input) {
          return moment(input, 'X').format(format);
        }
      }
    });
})(window.angular);

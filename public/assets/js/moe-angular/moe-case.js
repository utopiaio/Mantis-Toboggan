(function (angular) {
  'use strict';

  angular.module('moeCase', [])
    .filter('lowerCase', function () {
      return function (input) {
        if (input) {
          return input.toLowerCase();
        }
      };
    });
})(window.angular);

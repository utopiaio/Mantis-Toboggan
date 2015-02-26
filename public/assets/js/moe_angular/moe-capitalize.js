(function (angular) {
  'use strict';

  angular.module('moeCapitalize', [])
    .filter('lowerCase', function () {
      return function (input) {
        if (input) {
          return input.toLowerCase();
        }
      };
    });
})(window.angular);

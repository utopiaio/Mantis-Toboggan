(function (angular) {
  'use strict';

  angular.module('moeVFill', [])
    .directive('fillV', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attribute) {
          var windowHeight = $(window).height() + 'px';

          $(window).resize(function () {
            windowHeight = $(window).height() + 'px';

            $(element).css({
              'height': windowHeight,
              'min-height': windowHeight,
              'max-height': windowHeight,
              'border': '2px solid red'
            });
          });

          $(element).css({
            'height': windowHeight,
            'min-height': windowHeight,
            'max-height': windowHeight,
            'border': '2px solid red'
          });
        }
      }
    });
})(window.angular);

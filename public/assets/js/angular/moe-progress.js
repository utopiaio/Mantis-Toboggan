(function (angular) {
  'use strict';

  angular.module('moeProgressMaterial', ['ngMaterial'])
    .config(config)
    .factory('xhrInProgress', xhrInProgress);

  config.$inject = ['$routeProvider', '$httpProvider'];
  xhrInProgress.$inject = ['$rootScope', '$mdToast'];

  function config ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q) {
      $rootScope.xhrInProgress = false;

      return {
       'request': function(config) {
          $rootScope.xhrInProgress = true;
          return config;
        },

        'response': function(response) {
          $rootScope.xhrInProgress = false;
          return response;
        },

        'responseError': function (rejection) {
          $rootScope.xhrInProgress = false;
          return $q.reject(rejection);
        }
      };

    });
  }

  function xhrInProgress ($rootScope, $mdToast) {
    return {
      listenToXHR: function () {
        var loadingToast = null;
        $rootScope.$watch('xhrInProgress', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            if (newVal === true) {
              loadingToast = $mdToast.show({
                controller: function () {},
                template: '<md-toast class="fixed-toast">'+
                             '<div flex layout="row" layout-align="start center">'+
                              '<div flex="20"><md-progress-circular md-mode="indeterminate" md-diameter="24"></md-progress-circular></div>'+
                              '<div flex>it\'s <span class="showtime">SHOWTIME</span>...<small><i>almost</i></small></div>'+
                            '</div>'+
                          '</md-toast>',
                hideDelay: false,
                position: 'bottom left'
              });
            } else if (newVal === false) {
              $mdToast.hide(loadingToast);
            }
          }
        });
      }
    };
  }

})(window.angular);

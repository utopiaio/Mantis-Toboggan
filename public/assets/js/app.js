(function (angular) {
  'use strict';

  angular
    .module('showtime', ['ngRoute', 'ngTouch', 'ngAria', 'ngAnimate', 'ngMaterial', 'moeProgressMaterial'])
    .config(Config)
    .controller('ShowtimeController', ShowtimeController);

  Config.$inject = ['$routeProvider', '$locationProvider', '$mdThemingProvider'];
  ShowtimeController.$inject = ['$http', '$location', 'xhrInProgress'];

  function Config ($routeProvider, $locationProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange')
        .warnPalette('red')
        .backgroundPalette('grey');

    $locationProvider.html5Mode(true);
  }

  function ShowtimeController ($http, $location, xhrInProgress) {
    // this makes sure our URL stays nice and clean
    $location.path('/').replace();
    // show toast while $http is in progress
    xhrInProgress.listenToXHR();
    // it's SHOWTIME!
    $http.get('showtime');
  }

})(window.angular);

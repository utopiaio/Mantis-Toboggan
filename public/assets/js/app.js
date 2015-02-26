(function (angular) {
  'use strict';

  angular
    .module('showtime', ['ngRoute', 'ngTouch', 'ngAria', 'ngAnimate', 'ngMaterial', 'moeVFill'])
    .config(Config)
    .controller('ShowtimeController', ShowtimeController);

  Config.$inject = ['$routeProvider', '$locationProvider', '$mdThemingProvider'];
  ShowtimeController.$inject = ['$http', '$location', '$mdToast'];

  function Config ($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider
      .when('/cinema-1', {
        templateUrl: 'views/cinema-1.html',
      })

      .when('/cinema-2', {
        templateUrl: 'views/cinema-2.html',
      })

      .when('/cinema-3', {
        templateUrl: 'views/cinema-3.html',
      })

      .when('/about', {
        templateUrl: 'views/about.html'
      })

      .otherwise({
        redirectTo: '/cinema-1'
      });

    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange')
        .warnPalette('red')
        .backgroundPalette('grey');

    $locationProvider.html5Mode(true);
  }

  function ShowtimeController ($http, $location, $mdToast) {
    var vm = this;
    vm.path = '/cinema-1';
    vm.navigator = navigator;

    // var itsShowTimeToast = $mdToast.show({
    //   template: '<md-toast class="fixed-toast">'+
    //                '<div flex layout="row" layout-align="start center">'+
    //                 '<div flex="20"><md-progress-circular md-mode="indeterminate" md-diameter="24"></md-progress-circular></div>'+
    //                 '<div flex>it\'s <span class="showtime">SHOWTIME</span>...<small><i>almost</i></small></div>'+
    //               '</div>'+
    //             '</md-toast>',
    //   hideDelay: false,
    //   position: 'bottom left'
    // });

    // it's SHOWTIME!
    // $http.get('showtime')
    //   .success(function (data) {
    //     $mdToast.hide(itsShowTimeToast);
    //     vm.list = data;
    //   });

    function navigator (path) {
      $location.path(path);
      vm.path = path;
    }
  }

})(window.angular);

(function (angular) {
  'use strict';

  angular
    .module('showtime', ['ngRoute', 'ngTouch', 'ngAria', 'ngAnimate', 'ngMaterial', 'moeCapitalize', 'moeMoment'])
    .config(Config)
    .controller('ShowtimeController', ShowtimeController);

  Config.$inject = ['$routeProvider', '$locationProvider', '$mdThemingProvider'];
  ShowtimeController.$inject = ['$rootScope', '$http', '$location', '$mdToast'];

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
        .primaryPalette('pink')
        .accentPalette('orange')
        .warnPalette('red')
        .backgroundPalette('grey');

    $locationProvider.html5Mode(true);
  }

  function ShowtimeController ($rootScope, $http, $location, $mdToast) {
    $rootScope.$on('$routeChangeSuccess', function (event, target) {
      setTimeout(function () {
        $('html, body').animate({scrollTop: 0}, 0, 'linear');
      }, 0);
    });

    var vm = this;
    vm.cinemaKeys = {
      'One': [],
      'Two': [],
      'Three': []
    };
    vm.path = $location.path();
    vm.today = moment().format('dddd');
    vm.showOnlyToday = true;
    vm.navigator = navigator;

    var itsShowTimeToast = $mdToast.show({
      template: '<md-toast class="fixed-toast">'+
                   '<div flex layout="row" layout-align="start center">'+
                    '<div flex="20"><md-progress-circular md-mode="indeterminate" md-diameter="24"></md-progress-circular></div>'+
                    '<div flex>it\'s <span class="showtime">SHOWTIME</span>...<small><i>almost</i></small></div>'+
                  '</div>'+
                '</md-toast>',
      hideDelay: false,
      position: 'bottom left'
    });

    // it's SHOWTIME!
    $http.get('showtime')
      .success(function (data) {
        $mdToast.hide(itsShowTimeToast);
        vm.list = data;

        // we're using Keys to sort the dates
        vm.cinemaKeys = {
          'One': Object.keys(vm.list.cinemaOne).map(function (value) { return Number(value); }).sort(),
          'Two': Object.keys(vm.list.cinemaTwo).map(function (value) { return Number(value); }).sort(),
          'Three': Object.keys(vm.list.cinemaThree).map(function (value) { return Number(value); }).sort()
        };
      });

    function navigator (path) {
      vm.path = path;
      $location.path(path);
    }
  }

})(window.angular);

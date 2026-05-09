(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .controller('NavController', NavController);

  NavController.$inject = ['$scope', 'AuthService', '$state'];

  function NavController($scope, AuthService, $state) {
    $scope.isLoggedIn = AuthService.isLoggedIn;

    $scope.logout = function() {
      AuthService.logout();
      $state.go('login');
    };
  }
})();

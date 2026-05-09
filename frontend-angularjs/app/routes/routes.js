(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .config(routeConfig)
    .run(routeGuard);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: '/app/templates/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        data: { requiresAuth: false }
      })
      .state('register', {
        url: '/register',
        templateUrl: '/app/templates/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm',
        data: { requiresAuth: false }
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: '/app/templates/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .state('profile', {
        url: '/profile',
        templateUrl: '/app/templates/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .state('editProfile', {
        url: '/edit-profile',
        templateUrl: '/app/templates/editProfile.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      })
      .state('changePassword', {
        url: '/change-password',
        templateUrl: '/app/templates/changePassword.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: { requiresAuth: true }
      });
  }

  routeGuard.$inject = ['$transitions', 'AuthService', '$state'];

  function routeGuard($transitions, AuthService, $state) {
    $transitions.onBefore({}, function(transition) {
      var toState = transition.to();
      if (toState.data && toState.data.requiresAuth && !AuthService.isLoggedIn()) {
        return $state.target('login');
      }
      if (toState.name === 'login' && AuthService.isLoggedIn()) {
        return $state.target('dashboard');
      }
    });
  }
})();

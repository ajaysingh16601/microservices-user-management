(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .factory('AuthGuard', AuthGuard);

  AuthGuard.$inject = ['AuthService', '$state'];

  function AuthGuard(AuthService, $state) {
    var guard = {
      requireAuth: requireAuth,
      redirectIfLoggedIn: redirectIfLoggedIn
    };

    return guard;

    // Check if user is logged in, redirect to login if not
    function requireAuth() {
      if (!AuthService.isLoggedIn()) {
        $state.go('login');
        return false;
      }
      return true;
    }

    // Redirect to dashboard if already logged in
    function redirectIfLoggedIn() {
      if (AuthService.isLoggedIn()) {
        $state.go('dashboard');
        return false;
      }
      return true;
    }
  }
})();

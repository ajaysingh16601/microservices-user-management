(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .factory('AuthService', AuthService);

  AuthService.$inject = ['$http', '$window'];

  function AuthService($http, $window) {
    var AUTH_URL = 'http://localhost:3001';

    var service = {
      login: login,
      register: register,
      logout: logout,
      getToken: getToken,
      isLoggedIn: isLoggedIn,
      setToken: setToken
    };

    return service;

    function login(credentials) {
      return $http.post(AUTH_URL + '/auth/login', credentials)
        .then(function(response) {
          setToken(response.data.token);
          return response.data;
        });
    }

    function register(userData) {
      return $http.post(AUTH_URL + '/auth/register', userData)
        .then(function(response) {
          setToken(response.data.token);
          return response.data;
        });
    }

    function logout() {
      $http.post(AUTH_URL + '/auth/logout', {}, {
        headers: { Authorization: 'Bearer ' + getToken() }
      });
      $window.localStorage.removeItem('token');
    }

    function getToken() {
      return $window.localStorage.getItem('token');
    }

    function setToken(token) {
      $window.localStorage.setItem('token', token);
    }

    function isLoggedIn() {
      return !!getToken();
    }
  }
})();

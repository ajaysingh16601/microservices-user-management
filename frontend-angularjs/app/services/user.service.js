(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .factory('UserService', UserService);

  UserService.$inject = ['$http', 'AuthService'];

  function UserService($http, AuthService) {
    var USER_URL = 'http://localhost:3002';

    var service = {
      getProfile: getProfile,
      updateProfile: updateProfile,
      changePassword: changePassword,
      uploadPhoto: uploadPhoto,
      getDashboard: getDashboard
    };

    return service;

    function getHeaders() {
      return {
        headers: { Authorization: 'Bearer ' + AuthService.getToken() }
      };
    }

    function getProfile() {
      return $http.get(USER_URL + '/users/profile', getHeaders())
        .then(function(response) {
          return response.data;
        });
    }

    function updateProfile(data) {
      return $http.put(USER_URL + '/users/profile', data, getHeaders())
        .then(function(response) {
          return response.data;
        });
    }

    function changePassword(data) {
      return $http.put(USER_URL + '/users/change-password', data, getHeaders())
        .then(function(response) {
          return response.data;
        });
    }

    function uploadPhoto(file) {
      var fd = new FormData();
      fd.append('photo', file);

      return $http.post(USER_URL + '/users/upload-photo', fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined,
          Authorization: 'Bearer ' + AuthService.getToken()
        }
      }).then(function(response) {
        return response.data;
      });
    }

    function getDashboard() {
      return $http.get(USER_URL + '/users/dashboard', getHeaders())
        .then(function(response) {
          return response.data;
        });
    }
  }
})();

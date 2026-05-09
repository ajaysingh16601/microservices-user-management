(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .constant('AppConfig', {
      AUTH_URL: 'https://auth-service-4cew.onrender.com',
      USER_URL: 'https://user-service-7m1w.onrender.com'
    });
})();
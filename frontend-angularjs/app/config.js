(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .constant('AppConfig', {
      AUTH_URL: 'http://localhost:3001',
      USER_URL: 'http://localhost:3002'
      // Change these to your Render URLs for production:
      // AUTH_URL: 'https://auth-service.onrender.com',
      // USER_URL: 'https://user-service.onrender.com'
    });
})();

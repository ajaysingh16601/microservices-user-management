(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['AuthService', '$state'];

  function LoginController(AuthService, $state) {
    var vm = this;

    vm.credentials = {
      email: '',
      password: ''
    };
    vm.error = '';
    vm.errors = {};
    vm.loading = false;

    vm.login = function() {
      vm.error = '';
      vm.errors = {};
      vm.loading = true;

      AuthService.login(vm.credentials)
        .then(function() {
          $state.go('dashboard');
        })
        .catch(function(err) {
          console.log('Login error:', err);
          var data = err.data;
          
          if (data && data.message) {
            if (typeof data.message === 'object' && !Array.isArray(data.message)) {
              vm.errors = data.message;
              vm.error = '';
            } else {
              vm.error = Array.isArray(data.message) ? data.message.join(', ') : data.message;
              vm.errors = {};
            }
          } else {
            vm.error = 'Login failed. Please try again.';
          }
        })
        .finally(function() {
          vm.loading = false;
        });
    };
  }
})();

(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['AuthService', '$state'];

  function RegisterController(AuthService, $state) {
    var vm = this;

    vm.user = {
      name: '',
      email: '',
      password: '',
      phone: ''
    };
    vm.error = '';
    vm.errors = {};
    vm.loading = false;

    vm.register = function() {
      vm.error = '';
      vm.errors = {};
      vm.loading = true;

      AuthService.register(vm.user)
        .then(function() {
          $state.go('dashboard');
        })
        .catch(function(err) {
          console.log('Registration error:', err);
          var data = err.data;
          
          if (data && data.message) {
            if (typeof data.message === 'object' && !Array.isArray(data.message)) {
              // Structured field errors
              vm.errors = data.message;
              vm.error = ''; // Ensure general error is empty
            } else {
              // General string or array error
              vm.error = Array.isArray(data.message) ? data.message.join(', ') : data.message;
              vm.errors = {};
            }
          } else {
            vm.error = 'Registration failed. Please try again.';
          }
        })
        .finally(function() {
          vm.loading = false;
        });
    };
  }
})();

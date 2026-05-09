(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['UserService', '$state'];

  function ChangePasswordController(UserService, $state) {
    var vm = this;

    vm.data = {
      oldPassword: '',
      newPassword: ''
    };
    vm.error = '';
    vm.errors = {};
    vm.success = '';
    vm.loading = false;

    vm.changePassword = function() {
      vm.error = '';
      vm.errors = {};
      vm.success = '';
      vm.loading = true;

      UserService.changePassword(vm.data)
        .then(function(response) {
          vm.success = response.message || 'Password changed successfully';
          vm.data = { oldPassword: '', newPassword: '' };
        })
        .catch(function(err) {
          if (err.data && err.data.message) {
            if (typeof err.data.message === 'object' && !Array.isArray(err.data.message)) {
              vm.errors = err.data.message;
            } else {
              vm.error = Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message;
            }
          } else {
            vm.error = 'Failed to change password.';
          }
        })
        .finally(function() {
          vm.loading = false;
        });
    };

    vm.goBack = function() {
      $state.go('profile');
    };
  }
})();

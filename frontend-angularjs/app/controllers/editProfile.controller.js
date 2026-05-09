(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['UserService', '$state'];

  function EditProfileController(UserService, $state) {
    var vm = this;

    vm.user = {};
    vm.error = '';
    vm.errors = {};
    vm.loading = true;
    vm.saving = false;

    activate();

    function activate() {
      UserService.getProfile()
        .then(function(data) {
          vm.user = {
            name: data.name,
            email: data.email,
            phone: data.phone || ''
          };
        })
        .catch(function(err) {
          console.error('Load profile error:', err);
        })
        .finally(function() {
          vm.loading = false;
        });
    }

    vm.save = function() {
      vm.error = '';
      vm.errors = {};
      vm.saving = true;

      UserService.updateProfile(vm.user)
        .then(function() {
          $state.go('profile');
        })
        .catch(function(err) {
          console.log('Update profile error:', err);
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
            vm.error = 'Update failed.';
          }
        })
        .finally(function() {
          vm.saving = false;
        });
    };

    vm.cancel = function() {
      $state.go('profile');
    };
  }
})();

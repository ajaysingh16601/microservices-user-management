(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['UserService', '$state', 'AppConfig'];

  function ProfileController(UserService, $state, AppConfig) {
    var vm = this;

    vm.user = null;
    vm.loading = true;
    vm.uploading = false;
    vm.photoFile = null;
    vm.USER_SERVICE_URL = AppConfig.USER_URL;

    activate();

    function activate() {
      UserService.getProfile()
        .then(function(data) {
          vm.user = data;
        })
        .catch(function(err) {
          console.error('Profile error:', err);
        })
        .finally(function() {
          vm.loading = false;
        });
    }

    vm.goToEdit = function() {
      $state.go('editProfile');
    };

    vm.goToChangePassword = function() {
      $state.go('changePassword');
    };

    vm.uploadPhoto = function() {
      var fileInput = document.getElementById('photoInput');
      if (fileInput.files.length === 0) return;

      vm.uploading = true;
      UserService.uploadPhoto(fileInput.files[0])
        .then(function(data) {
          vm.user = data;
        })
        .catch(function(err) {
          console.error('Upload error:', err);
        })
        .finally(function() {
          vm.uploading = false;
        });
    };
  }
})();

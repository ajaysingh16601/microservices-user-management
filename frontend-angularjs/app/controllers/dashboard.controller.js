(function() {
  'use strict';

  angular
    .module('userManagementApp')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['UserService'];

  function DashboardController(UserService) {
    var vm = this;

    vm.data = null;
    vm.loading = true;

    activate();

    function activate() {
      UserService.getDashboard()
        .then(function(data) {
          vm.data = data;
        })
        .catch(function(err) {
          console.error('Dashboard error:', err);
        })
        .finally(function() {
          vm.loading = false;
        });
    }
  }
})();

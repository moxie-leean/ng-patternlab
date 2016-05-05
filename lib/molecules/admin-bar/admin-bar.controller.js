angular
  .module('lnPatterns')
  .controller('lnMAdminBarController', lnMAdminBarController);

lnMAdminBarController.$inject = ['$log', '$rootScope', '$scope', 'lnMAdminBarService'];

function lnMAdminBarController($log, $rootScope, $scope, lnMAdminBarService) {
  var vm = this;
  var initialized = false;

  angular.extend(vm, {
    $scope: $scope,
    adminBarEnabled: false
  });

  if (vm.lnLoadFromApi) {
    if (lnMAdminBarService.getApiUrl() === '') {
      $rootScope.$on('lnMAdminBarUrlSet', init);
    } else {
      init();
    }
  } else {
    vm.adminBarEnabled = true;
  }

  function init() {
    if (!initialized) {
      initialized = true;

      lnMAdminBarService
        .getAdminBarData()
        .then(_configureAdminBar, _configureAdminBar);
    }
  }

  function _configureAdminBar(response) {
    if (response.data) {
      vm.lnSiteName = response.data.site_name;
      vm.lnUserName = response.data.user_name;
      vm.lnDashboardUrl = response.data.dashboard_url;
      vm.lnLogoutUrl = response.data.logout_url;
      vm.lnEditPageUrl = response.data.edit_page_url;
      vm.lnNewItemTypes = response.data.post_types;

      if (vm.lnUserName && vm.lnUserName !== '') {
        vm.adminBarEnabled = true;
      }
    }
  }
}
angular
  .module('lnPatterns')
  .controller('lnMAdminBarController', lnMAdminBarController);

lnMAdminBarController.$inject = ['$log', '$rootScope', '$scope', '$cookies', '$timeout', '$element', 'lnMAdminBarService'];

function lnMAdminBarController($log, $rootScope, $scope, $cookies, $timeout, $element, lnMAdminBarService) {
  var vm = this;
  var status = 0; //0=init, 1=loading, 2=loadad
  var loginCookie = '';

  if (vm.lnLoadFromApi) {
    _disableAdminBar();
    _loginCheck();
  } else {
    _enableAdminBar();
  }

  /////////

  function _loginCheck() {
    loginCookie = $cookies.get('wp_admin_bar_user') || '';

    if (status === 0 && loginCookie !== '') {
      _loadData();
    } 

    if ((status === 1 || status === 2) && loginCookie === '') {
      status = 0;
      _disableAdminBar();
    }

    $timeout(_loginCheck, 5000);
  }

  function _loadData() {
    if (lnMAdminBarService.getApiUrl() !== '') {
      status = 1;

      lnMAdminBarService
        .getAdminBarData()
        .then(_configureAdminBar, _logError);
    }
  }

  function _configureAdminBar(response) {
    if (response.data && status === 1) {
      status = 2;

      vm.lnSiteName = response.data.site_name;
      vm.lnUserName = response.data.user_name || loginCookie;
      vm.lnDashboardUrl = response.data.dashboard_url;
      vm.lnLogoutUrl = response.data.logout_url;
      vm.lnEditPageUrl = response.data.edit_page_url;
      vm.lnNewItemTypes = response.data.post_types;
      
      _enableAdminBar();
    }
  }

  function _logError(error) {
    $log.error('lnMAdminBarService.getAdminBarData() -> error: ', error);
  }

  function _enableAdminBar() {
    vm.adminBarEnabled = true;
    $element.removeClass('ng-hide');
  }

  function _disableAdminBar() {
    vm.adminBarEnabled = false;
    $element.addClass('ng-hide');
  }  
}
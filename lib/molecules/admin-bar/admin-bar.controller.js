angular
  .module('lnPatterns')
  .controller('lnMAdminBarController', lnMAdminBarController);

lnMAdminBarController.$inject = ['$log', '$rootScope', '$scope', '$cookies', '$timeout', '$element', 'lnMAdminBarService'];

var STATUS = {
  INIT: 0,
  LOADING: 1,
  LOADED: 2
};

function lnMAdminBarController($log, $rootScope, $scope, $cookies, $timeout, $element, lnMAdminBarService) {
  var vm = this;
  var status = STATUS.INIT;
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
    _reviewStatus();
    $timeout(_loginCheck, 5000);
  }

  function _reviewStatus(){
    if (status === STATUS.INIT && loginCookie !== '') {
      _loadData();
    }

    if ((status === STATUS.LOADING || status === STATUS.LOADED) && loginCookie === '') {
      status = STATUS.INIT;
      _disableAdminBar();
    }
  }

  function _loadData() {
    if (lnMAdminBarService.getApiUrl() !== '') {
      status = STATUS.LOADING;

      lnMAdminBarService
        .getAdminBarData()
        .then(_configureAdminBar, _logError);
    }
  }

  function _configureAdminBar(response) {
    if (response.data && status === STATUS.LOADING) {
      status = STATUS.LOADED;

      vm.lnSiteName = response.data.site_name;
      vm.lnUserName = response.data.user_name || loginCookie;
      vm.lnDashboardUrl = response.data.dashboard_url;
      vm.lnLogoutUrl = response.data.logout_url;
      vm.lnEditPageUrl = response.data.edit_page_url;
      vm.lnNewItemTypes = response.data.post_types;
      vm.lnUserNicename = angular.isDefined( response.data.nicename ) ? response.data.nicename : '';
      vm.lnUserDisplayName = angular.isDefined( response.data.display_name ) ? response.data.display_name : '';
      vm.lnUserFirstName = angular.isDefined( response.data.first_name ) ? response.data.first_name : '';
      vm.lnUserLastName = angular.isDefined( response.data.last_name ) ? response.data.last_name : '';
      vm.lnUserEmail = angular.isDefined( response.data.email ) ? response.data.email : '';

      _enableAdminBar();
    }
  }

  function _logError(error) {
    $log.error('lnMAdminBarService.getAdminBarData() -> error: ', error);
  }

  function _enableAdminBar() {
    vm.adminBarEnabled = true;
    $element.removeClass('ng-hide');
    $rootScope.$broadcast('lnMAdminBarEnabled', vm);
  }

  function _disableAdminBar() {
    vm.adminBarEnabled = false;
    $element.addClass('ng-hide');
    $rootScope.$broadcast('lnMAdminBarDisabled', {});
  }
}

angular
  .module('lnPatterns')
  .directive('lnMAdminBar', lnMAdminBar);

function lnMAdminBar() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/admin-bar/template.html',
    scope: {},
    controller: 'lnMAdminBarController',
    controllerAs: 'vm',
    bindToController: {
      lnLoadFromApi: '=',
      lnSiteName: '@',
      lnUserName: '@',
      lnDashboardUrl: '@',
      lnLogoutUrl: '@',
      lnEditPageUrl: '@',
      lnNewItemTypes: '<'
    }
  };
}
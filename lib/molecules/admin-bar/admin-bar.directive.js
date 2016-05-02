angular
  .module('lnPatterns')
  .directive('lnMAdminBar', lnMAdminBar);

function lnMAdminBar() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/admin-bar/template.html',
    scope: {
      lnSiteName: '@',
      lnUserName: '@',
      lnDashboardUrl: '@',
      lnLogoutUrl: '@',
      lnEditPageUrl: '@',
      lnNewItemTypes: '<'
    }
  };
}
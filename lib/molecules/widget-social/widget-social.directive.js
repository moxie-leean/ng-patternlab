angular
  .module('lnPatterns')
  .directive('lnMWidgetSocial', lnMWidgetSocial);

function lnMWidgetSocial() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/widget-social/template.html',
    scope: {
      lnTitle: '<',
      lnItems: '<'
    }
  };
}
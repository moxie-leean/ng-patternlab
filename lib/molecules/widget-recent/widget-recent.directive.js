angular
  .module('lnPatterns')
  .directive('lnMWidgetRecent', lnMWidgetRecent);

function lnMWidgetRecent() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/widget-recent/template.html',
    scope: {
      lnTitle: '<',
      lnItems: '<'
    }
  };
}
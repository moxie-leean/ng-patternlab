angular
  .module('lnPatterns')
  .directive('lnMWidgetMenu', lnMWidgetMenu);

function lnMWidgetMenu() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/widget-menu/template.html',
    scope: {
      lnTitle: '<',
      lnItems: '<'
    }
  };
}
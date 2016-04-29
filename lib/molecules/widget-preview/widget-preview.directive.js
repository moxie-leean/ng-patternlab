angular
  .module('lnPatterns')
  .directive('lnMWidgetPreview', lnMWidgetPreview);

function lnMWidgetPreview() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/widget-preview/template.html',
    scope: {
      lnTitle: '<',
      lnLeanpreview: '<'
    }
  };
}
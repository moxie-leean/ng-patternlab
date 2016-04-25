angular
  .module('lnPatterns')
  .directive('lnMWidgetDownloads', lnMWidgetDownloads);

function lnMWidgetDownloads() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/widget-downloads/template.html',
    scope: {
      lnTitle: '<',
      lnItems: '<'
    }
  };
}
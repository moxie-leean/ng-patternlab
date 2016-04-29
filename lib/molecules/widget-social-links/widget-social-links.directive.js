angular
  .module('lnPatterns')
  .directive('lnMWidgetSocialLinks', lnMWidgetSocialLinks);

function lnMWidgetSocialLinks() {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/widget-social-links/template.html',
    scope: {
      lnTitle: '<',
      lnItems: '<'
    }
  };
}
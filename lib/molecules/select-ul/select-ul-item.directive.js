angular
  .module('lnPatterns')
  .directive('lnMSelectUlItem', lnMSelectUlItem);

function lnMSelectUlItem() {

  return {
    restrict: 'A',
    template: '<span ng-bind-html="lnLabel"></span>',
    scope: {
      lnLabel: '@'
    }
  };
}

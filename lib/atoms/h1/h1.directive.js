angular
  .module('lnPatterns')
  .directive('lnAH1', lnAH1);

function lnAH1() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'lnPatterns/atoms/h1/template.html',
    scope: {
      title: '@',
      class: '@'
    }
  };
}
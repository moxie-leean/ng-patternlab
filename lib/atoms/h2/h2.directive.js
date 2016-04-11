angular
  .module('lnPatterns')
  .directive('lnAH2', lnAH2);

function lnAH2() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'lnPatterns/atoms/h2/template.html',
    scope: {
      title: '@',
      class: '@'
    }
  };
}

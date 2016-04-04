angular
  .module('lnPatterns')
  .directive('lnAtomTitle1', lnAtomTitle1);

function lnAtomTitle1() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'lnPatterns/atoms/title1/template.html',
    scope: {
      title: '@',
      class: '@'
    }
  };
}
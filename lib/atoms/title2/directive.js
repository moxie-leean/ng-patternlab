angular
  .module('lnPatterns')
  .directive('lnAtomTitle2', lnAtomTitle2);

function lnAtomTitle2() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'lnPatterns/atoms/title2/template.html',
    scope: {
      title: '@',
      class: '@'
    }
  };
}

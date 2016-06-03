angular
  .module('lnPatterns')
  .directive('lnLogo', lnLogo);

function lnLogo() {

  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/logo/template.html',
    scope: {
      lnSrc: '@',
      lnSrcImage: '@',
      class: '@'
    }
  };
}

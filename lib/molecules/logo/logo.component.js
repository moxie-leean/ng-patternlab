angular
  .module('lnPatterns')
  .component('lnMLogo', {
    templateUrl: 'lnPatterns/molecules/logo/template.html',
    bindings: {
      lnHref: '@',
      lnSrc: '@',
      lnClass: '@'
    }
  });

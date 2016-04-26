angular
  .module('lnPatterns')
  .directive('lnMWidgetContact', lnMWidgetContact);

function lnMWidgetContact() {
  return {
    restrict: 'A',
    link: link,
    templateUrl: 'lnPatterns/molecules/widget-contact/template.html',
    scope: {
      lnTitle: '<',
      lnLogo: '<',
      lnAddress: '<',
      lnPhone: '<',
      lnEmail: '<'
    }
  };

  function link(scope) {
    if (scope.lnPhone.number) {
      scope.lnPhone.digits = scope.lnPhone.number.replace(/\D/g,'');
    }
  }
}
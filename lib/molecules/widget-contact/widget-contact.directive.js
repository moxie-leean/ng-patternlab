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
    if (scope.lnPhone) {
      scope.lnPhoneDigits = scope.lnPhone.replace(/\D/g,'');
    }
  }
}
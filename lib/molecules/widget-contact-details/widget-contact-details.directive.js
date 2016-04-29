angular
  .module('lnPatterns')
  .directive('lnMWidgetContactDetails', lnMWidgetContactDetails);

function lnMWidgetContactDetails() {
  return {
    restrict: 'A',
    link: link,
    templateUrl: 'lnPatterns/molecules/widget-contact-details/template.html',
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
angular
  .module('lnPatterns')
  .directive('lnMWidgetContact', lnMWidgetContact);

function lnMWidgetContact() {
  return {
    restrict: 'A',
    link: link,
    templateUrl: 'lnPatterns/molecules/widget-contact/template.html',
    scope: {
      lnContent: '<'
    }
  };

  function link(scope) {
    if (scope.lnContent.phone) {
      scope.lnContent.phone.digits = scope.lnContent.phone.number.replace(/\D/g,'');
    }
  }
}
angular
  .module('lnPatterns')
  .factory('lnOGravityConfirmationParser', lnOGravityConfirmationParser);

lnOGravityConfirmationParser.$inject = ['isValidParameterFilter'];

function lnOGravityConfirmationParser(isValidParameterFilter) {

  var confirmationMessageTemplate = '<div class="ln-o-gravity-form-confirmation" ng-show="vm.formSubmitted">{{message}}</div>';


  // Public API
  //

  return {
    parse: parse
  };

  function parse(data) {
    var _message = '';
    var _confirmation;

    if (isValidParameterFilter(data.response.confirmations)) {

      _confirmation = getDefaultConfirmation(data.response.confirmations);

      if (angular.isDefined(_confirmation)) {
        switch (_confirmation.type) {
          case 'message':
          default:
            _message = _confirmation.message;
            break;
        }
      }
    }

    return angular
      .copy(confirmationMessageTemplate)
      .replace(/{{message}}/gi, _message);
  }


  function getDefaultConfirmation(data) {
    for (var i in data) {
      if (data[i].hasOwnProperty('isDefault') && data[i].isDefault === true) {
        return data[i];
      }
    }
    return;
  }
}

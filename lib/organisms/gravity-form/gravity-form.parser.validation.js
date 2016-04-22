angular
  .module('lnPatterns')
  .factory('lnOGravityValidationParser', lnOGravityValidationParser);

/*@ngInject*/
function lnOGravityValidationParser($log, isValidParameterFilter) {

  var validationMessageTemplate = '<p>{{message}}</p>';


  // Public API
  //

  return {
    parse: parse
  };

  function parse(data) {
    $log.debug('lnOGravityValidationParser.parse() ->', data);

    var _message = '';
    if (isValidParameterFilter(data)) {
      _message = data;
    }

    return angular
      .copy(validationMessageTemplate)
      .replace(/{{message}}/gi, _message);
  }

}

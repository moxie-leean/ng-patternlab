angular
  .module('lnPatterns')
  .factory('lnOGravityErrorParser', lnOGravityErrorParser);

lnOGravityErrorParser.$inject = ['isValidObjectAndPropertyFilter'];

function lnOGravityErrorParser(isValidObjectAndPropertyFilter) {
  
  var errorTemplate = '<div class="ln-o-gravity-form-error">' +
    '<p>' +
    'Couldn\'t load form - please re-fresh the page to try again!' +
    '<br>' +
    '<span class="error-message">Message: {{message}}</span><br>' +
    '<span class="error-code">Code: {{code}}</span><br>' +
    '<span class="error-data">Data: {{data}}</span><br>' +
    '</p>' +
    '</div>';
  
  
  // Public API
  //
  
  return {
    parse: parse
  };
  
  function parse(data) {
    var _message;
    var _code;
    var _data;
    
    if (angular.isDefined(data) && data !== null) {
      _message = getMessage(data);
      _code = getCode(data);
      _data = getData(data);
    }
    
    return angular
      .copy(errorTemplate)
      .replace(/{{message}}/gim, _message)
      .replace(/{{code}}/gim, _code)
      .replace(/{{data}}/gim, _data);
  }
  
  
  // Internal
  //
  
  function getMessage(data) {
    if (angular.isString(data.response)) {
      return data.response;
    }
    
    if (isValidObjectAndPropertyFilter(data.response, 'message')) {
      return data.response.message;
    }
    
    return 'No message received from server';
  }
  
  function getCode(data) {
    if (angular.isString(data.response)) {
      return data.status;
    }
    
    if (isValidObjectAndPropertyFilter(data.response, 'code')) {
      return data.response.code;
    }
    
    return 'No code received from server';
  }
  
  function getData(data) {
    if (isValidObjectAndPropertyFilter(data.response, 'data')) {
      return data.response.data;
    }
    
    return 'No data received from server';
  }
  
}

angular
  .module('lnPatterns')
  .factory('lnOGravityFormTransformer', lnOGravityFormTransformer);

/*@ngInject*/
function lnOGravityFormTransformer(lnOGravityFormParser) {

  var ResponseCodes = {
    OK: 200,
    UNFINISHED: 202,
    ILLEGAL: 400,
    UNAUTHENTICATED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    UNSUPPORTED: 501
  };

  var fallbackErrorData = {
    status: -1,
    response: 'No data received from server'
  };

  var errorHTML = '<div class="ln-o-gravity-form-error">' +
    '<p>' +
    'Couldn\'t load form - please re-fresh the page to try again!' +
    '<br>' +
    '<span class="error-message">Message: {{message}}</span><br>' +
    '<span class="error-code">Code: {{code}}</span><br>' +
    '<span class="error-data">Data: {{data}}</span><br>' +
    '</p>' +
    '</div>';


  // Callbacks
  //

  function onFormError(data) {
    var _message;
    var _code;
    var _data;

    if (angular.isString(data.response)) {
      _code = data.status;
      _message = data.response;
    } else if (angular.isObject(data.response)) {
      _code = data.response.code;
      _message = data.response.message;
      _data = data.response.data || 'N/A';
    }

    return angular
      .copy(errorHTML)
      .replace(/{{message}}/gim, _message)
      .replace(/{{code}}/gim, _code)
      .replace(/{{data}}/gim, _data);
  }


  // Public
  //

  return function (data) {
    var pData = angular.fromJson(data);
    var response = {
      isValid: false,
      html: ''
    };

    if (!!pData && !!pData.status) {

      if (pData.status === ResponseCodes.OK) {
        response.isValid = true;
        response.html = lnOGravityFormParser.parse(pData.response);
      } else {
        response.html = onFormError(pData);
      }

    } else {
      // No data, or no 'status': Houston, we have a problem...
      response.html = onFormError(fallbackErrorData);
    }

    return response;
  };
}

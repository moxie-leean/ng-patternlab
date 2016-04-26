angular
  .module('lnPatterns')
  .factory('lnOGravityFormTransformer', lnOGravityFormTransformer);

lnOGravityFormTransformer.$inject = ['lnOGravityFormParser', 'lnOGravityErrorParser', 'lnOGravityConfirmationParser', 'camelCaseToDashCaseFilter'];

function lnOGravityFormTransformer(lnOGravityFormParser, lnOGravityErrorParser, lnOGravityConfirmationParser, camelCaseToDashCaseFilter) {

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

  // Public
  //

  return function (data) {
    var pData = angular.fromJson(data);

    var response = {
      isValid: false,
      html: ''
    };

    if (!!pData && !!pData.status && pData.status === ResponseCodes.OK) {
      response.isValid = true;
      response.formName = pData.formName = camelCaseToDashCaseFilter(pData.response.title);
      response.formId = 'ln-o-gravity-form-' + pData.response.id;
      response.html = lnOGravityFormParser.parse(pData);
      response.confirmationHtml = lnOGravityConfirmationParser.parse(pData)
    } else {
      response.html = lnOGravityErrorParser.parse(pData);
    }

    return response;
  };

}

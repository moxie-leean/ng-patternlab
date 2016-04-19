angular
    .module('lnPatterns')
    .factory('lnOGravityFormGETFormTransformer', lnOGravityFormGETFormTransformer);

/*@ngInject*/
function lnOGravityFormGETFormTransformer(lnOGravityFormParser) {

    var
        ResponseCodes = {
            OK: 200,
            UNFINISHED: 202,
            ILLEGAL: 400,
            UNAUTHENTICATED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            SERVER_ERROR: 500,
            UNSUPPORTED: 501
        }
        ,

        fallbackErrorData = {
            status: -1,
            response: 'No data received from server'
        }
        ,

        errorHTML  =  '<div class="ln-o-gravity-form-error">' +
                                        '<p>' +
                                            'Couldn\'t load form - please re-fresh the page to try again!' +
                                            '<br>' +
                                            '<span class="error-message">Message: {{message}}</span><br>' +
                                            '<span class="error-code">Code: {{code}}</span><br>' +
                                            '<span class="error-data">Data: {{data}}</span><br>' +
                                        '</p>' +
                                    '</div>'
    ;
    

    // Callbacks
    //

    function onFormError(data) {
        var _message, _code, _data = 'N/A';

        if (typeof data.response === 'string') {
            _code = data.status;
            _message = data.response;
        } else if (typeof data.response === 'object') {
            _code = data.response.code;
            _message = data.response.message;

            if (!!data.response.data) {
                _data = data.response.data;
            }
        }

        return angular
            .copy(errorHTML)
            .replace(/{{message}}/gim, _message)
            .replace(/{{code}}/gim, _code)
            .replace(/{{data}}/gim, _data)
        ;
    }


    // Public 
    //

    return function (data) {
        var
            pData = JSON.parse(data),
            response = {
                isValid: false,
                html: undefined
            }
        ;

        if (!!pData && !!pData.status) {

            switch (pData.status) {
                case ResponseCodes.OK:
                    response.isValid = true;
                    response.html = lnOGravityFormParser.parse(pData.response);
                    break;
                case ResponseCodes.ILLEGAL:
                case ResponseCodes.UNAUTHENTICATED:
                case ResponseCodes.FORBIDDEN:
                case ResponseCodes.NOT_FOUND:
                case ResponseCodes.SERVER_ERROR:
                case ResponseCodes.UNSUPPORTED:
                default:
                    response.html = onFormError(pData);
            }

        } else {
            // No data, or no 'status': Houston, we have a problem...
            response.html = onFormError(fallbackErrorData);
        }

        return response;
    }
}

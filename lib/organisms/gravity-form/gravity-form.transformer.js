angular
    .module('lnPatterns')
    .factory('lnOGravityFormGETFormTransformer', lnOGravityFormGETFormTransformer);

/*@ngInject*/
function lnOGravityFormGETFormTransformer($log, lnOGravityFormParser) {

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
    

    // Form load success / failure callbacks
    //

    function onFormError(data) {
        var _m, _c, _d = 'N/A';

        if (typeof data.response === "string") {
            _c = data.status;
            _m = data.response;
        } else if (typeof data.response === "object") {
            _c = data.response.code;
            _m = data.response.message;

            if (!!data.response.data) {
                _d = data.response.data;
            }
        }

        return angular
            .copy(errorHTML)
            .replace(/{{message}}/gim, _m)
            .replace(/{{code}}/gim, _c)
            .replace(/{{data}}/gim, _d)
        ;
    }

    function onFormSuccess(data) {
        return lnOGravityFormParser.parse(data.response);
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
                    response.html = onFormSuccess(pData);
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
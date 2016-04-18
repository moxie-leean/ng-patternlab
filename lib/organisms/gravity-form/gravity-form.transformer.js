angular
    .module('lnPatterns')
    .factory('lnOGravityFormGETFormTransformer', lnOGravityFormGETFormTransformer);

/*@ngInject*/
function lnOGravityFormGETFormTransformer(isValidParameterFilter) {

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

        inputTypes = {
            // TODO
        }
        ,

        fallbackErrorData = {
            status: -1,
            response: 'No data received from server'
        }
        ,

        // BASE FORM HTML ELEMENTS - MOVE THESE TO A SEPARATE FILE?
        //

        errorHTML  =  '<div class="ln-o-gravity-form-error">' +
                                        '<p>' +
                                            'Couldn\'t load form - please re-fresh the page to try again!' +
                                            '<br>' +
                                            '<span class="error-message">Message: {{message}}</span><br>' +
                                            '<span class="error-code">Code: {{code}}</span><br>' +
                                            '<span class="error-data">Data: {{data}}</span><br>' +
                                        '</p>' +
                                    '</div>'
        ,

        labelHTML = '<label for="{{for}}">{{text}}<span ng-show="{{required}}">*</span></label>'
        ,

        inputHTML = '<input type="{{type}}" name="{{name}}" id="{{id}}" value="{{value}}" required="{{required}}" placeholder="{{placeholder}}">'
        ,

        textareaHTML = '<textarea name="{{name}}" id="{{id}}" placeholder="{{placeholder}}" value="{{value}}"></textarea>'
        ,



        submitHTML = '<button type="submit" ng-disabled="!$ctrl.form.$valid">{{text}}</button>'
    ;


    // Parse methods
    //

    function parseLabel(isFor, text, required) {
        return angular
            .copy(labelHTML)
            .replace(/{{for}}/gi, isFor)
            .replace(/{{text}}/gi, text)
            .replace(/{{required}}/gi, required)
        ;
    }

    function parseInput(data) {
        var
            _id = 'input_' + data.id,
            _name = isValidParameterFilter(data.name) ? data.name : _id,
            _value =  isValidParameterFilter(data.value) ? data.value : ''
        ;

        return angular
            .copy(inputHTML)
            .replace(/{{type}}/gi, data.type)
            .replace(/{{name}}/gi, _name)
            .replace(/{{id}}/gi, _id)
            .replace(/{{value}}/gi, _value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
        ;
    }

    function parseTextarea(data) {
        var
            _id = 'input_' + data.id,
            _name = isValidParameterFilter(data.name) ? data.name : _id,
            _value =  isValidParameterFilter(data.value) ? data.value : ''
        ;

        return angular
            .copy(textareaHTML)
            .replace(/{{name}}/gi, _name)
            .replace(/{{id}}/gi, _id)
            .replace(/{{value}}/gi, _value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
        ;
    }

    function parseSubmitButton(text) {
        return angular
            .copy(submitHTML)
            .replace(/{{text}}/gi, text || "Submit")
        ;
    }


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

    // TODO: Form HTML to pass back to controller based on JSON data
    function onFormSuccess(data) {
        var _data = data.response;
        var _fields = _data.fields;
        var _html = '';

        angular.forEach(_fields, function(field) {
            console.log(field);
            switch (field.type) {
                case "text":
                case "number":
                case "email":
                case "hidden":
                    _html += parseInput(field);
                    break;
                case "textarea":
                    _html += parseTextarea(field);
                    break;
                case "radio":
                case "checkbox":
                case "select":
                case "multiselect":
                    // TODO
                    break;
                default:
                    break;
            }
        });

        _html += parseSubmitButton(_data.button.text);
        return _html;
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
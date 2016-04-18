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


    // Parse methods
    //

    // TODO: fix hide if not required
    function parseLabel(isFor, text, required) {
        return '<label for="{{for}}">{{text}}<span ng-if="{{required}}">*</span></label>'
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

        return '<input type="{{type}}" name="{{name}}" id="{{id}}" value="{{value}}" required="{{required}}" placeholder="{{placeholder}}">'
            .replace(/{{type}}/gi, data.type)
            .replace(/{{id}}/gi, _id)
            .replace(/{{name}}/gi, _name)
            .replace(/{{value}}/gi, _value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
            .replace(/{{selected}}/gi, data.isSelected)
        ;
    }

    function parseRadioInput(data) {
        var
            _id = data.id,
            _name = isValidParameterFilter(data.name) ? data.name : _id,
            _value =  isValidParameterFilter(data.value) ? data.value : ''
        ;

        return '<input type="{{type}}" id="{{id}}" name="{{name}}"  value="{{value}}" {{checked}}>'
            .replace(/{{type}}/gi, data.type)
            .replace(/{{id}}/gi, _id)
            .replace(/{{name}}/gi, _name)
            .replace(/{{value}}/gi, _value)
            .replace(/{{checked}}/gi, !!data.isSelected ? 'checked' : '')
        ;
    }

    function parseTextarea(data) {
        var
            _id = 'input_' + data.id,
            _name = isValidParameterFilter(data.name) ? data.name : _id,
            _value =  isValidParameterFilter(data.value) ? data.value : ''
        ;

        return '<textarea name="{{name}}" id="{{id}}" placeholder="{{placeholder}}" value="{{value}}"></textarea>'
            .replace(/{{name}}/gi, _name)
            .replace(/{{id}}/gi, _id)
            .replace(/{{value}}/gi, _value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
        ;
    }

    function parseRadioButtonList(data) {
        var _radioButtonList = '<ul>';

        var index = 0;
        angular.forEach(data.choices, function(choice) {
            choice.type = data.type;
            choice.id = 'choice_' + data.formId + '_' + data.id + '_' + index;
            choice.name = 'input_' + data.id;

            _radioButtonList += '<li>'
                                    + parseRadioInput(choice)
                                    + parseLabel(choice.id, choice.text, false);
                                '</li>';

            index++;
        });

        _radioButtonList += '</ul>';

        return _radioButtonList;
    }

    function parseSubmitButton(text) {
        return '<button type="submit" ng-disabled="!$ctrl.form.$valid">{{text}}</button>'
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
                    _html += parseRadioButtonList(field);
                    break;
                // TODO: add in parsing of the following elements
                case "checkbox":
                case "select":
                case "multiselect":
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

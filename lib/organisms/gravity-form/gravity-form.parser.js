angular
    .module('lnPatterns')
    .factory('lnOGravityFormParser', lnOGravityFormParser);

/*@ngInject*/
function lnOGravityFormParser($log, isValidParameterFilter) {

    var inputTypes = {
        // TODO
    }
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
    
    
    // Public API
    //
    
    return {
        
        // TODO: render form header, form body, form footer as container divs
        //       put submit button in footer
        //       support paged forms
        parse: function (formData) {
            $log.debug(formData);
            
            var _fields = formData.fields;
            var _html = '';

            angular.forEach(_fields, function(field) {
                $log.debug(field);
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

            _html += parseSubmitButton(formData.button.text);
            return _html;
        }
    }

}

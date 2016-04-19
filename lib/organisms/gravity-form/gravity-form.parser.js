angular
    .module('lnPatterns')
    .factory('lnOGravityFormParser', lnOGravityFormParser);

/*@ngInject*/
function lnOGravityFormParser($log, isValidParameterFilter) {

    var formTemplate = '' +
            '<div class="ln-o-gravity-form">' +
                '<div class="ln-o-gravity-form-header">' +
                    '<h3 class="title">{{title}}</h3>' +
                    '<span class="description">{{description}}</span>' +
                '</div>' +
                '<div class="ln-o-gravity-form-body">' +
                    '<ul class="fields">' +
                        '{{fields}}' +
                    '</ul>' +
                '</div>' +
                '<div class="ln-o-gravity-form-footer">' +
                    '{{submit}}' +
                '</div>' +
            '</div>'
        ;


    // Internal
    //

    function parseRequiredFlag() {
        return '<span>*</span>';
    }

    function parseLabel(isFor, text, required) {
        return '<label for="{{for}}">{{text}}{{required}}</label>'
            .replace(/{{for}}/gi, isFor)
            .replace(/{{text}}/gi, text)
            .replace(/{{required}}/gi, required !== false ? parseRequiredFlag() : '')
        ;
    }

    function parseTextarea(data) {
        var
            _id = isValidParameterFilter(data.id) ? data.id : '',
            _name = isValidParameterFilter(data.name) ? data.name : _id,
            _value = isValidParameterFilter(data.value) ? data.value : ''
        ;

        return '<textarea name="{{name}}" id="{{id}}" placeholder="{{placeholder}}" value="{{value}}"></textarea>'
            .replace(/{{name}}/gi, _name)
            .replace(/{{id}}/gi, _id)
            .replace(/{{value}}/gi, _value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
        ;
    }

    function parseInput(data) {
        var
            _id = isValidParameterFilter(data.id) ? data.id : '',
            _name = isValidParameterFilter(data.name) ? data.name : _id,
            _value = isValidParameterFilter(data.value) ? data.value : '',
            _hidden = data.type === "hidden"
        ;

        return '<input type="{{type}}" name="{{name}}" id="{{id}}" value="{{value}}" required="{{required}}" placeholder="{{placeholder}}" class="{{hidden}}">'
            .replace(/{{type}}/gi, data.type)
            .replace(/{{id}}/gi, _id)
            .replace(/{{name}}/gi, _name)
            .replace(/{{value}}/gi, _value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
            .replace(/{{selected}}/gi, data.isSelected)
            .replace(/{{hidden}}/gi, _hidden ? 'hidden' : '')
        ;
    }

    function parseRadioInput(data) {
        var
            _id = isValidParameterFilter(data.id) ? data.id : '',
            _name = isValidParameterFilter(data.name) ? data.name : _id,
            _value = isValidParameterFilter(data.value) ? data.value : ''
        ;

        return '<input type="{{type}}" id="{{id}}" name="{{name}}"  value="{{value}}" {{checked}}>'
            .replace(/{{type}}/gi, data.type)
            .replace(/{{id}}/gi, _id)
            .replace(/{{name}}/gi, _name)
            .replace(/{{value}}/gi, _value)
            .replace(/{{checked}}/gi, !!data.isSelected ? 'checked' : '')
        ;
    }

    function parseRadioButtonList(data) {
        var _radioButtonList = '<ul>';

        var index = 0;
        angular.forEach(data.choices, function (choice) {
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
        return '<button type="submit" ng-disabled="!$ctrl.form.$valid" class="submit">{{text}}</button>'
            .replace(/{{text}}/gi, text || "Submit")
        ;
    }

    function parseField(fieldHTML, labelHTML, isHidden) {
        return '<li class="field{{hidden}}">{{label}}{{field}}</li>'
            .replace(/{{hidden}}/gi, isHidden ? ' hidden' : '')
            .replace(/{{label}}/gi, labelHTML)
            .replace(/{{field}}/gi, fieldHTML)
        ;
    }

    function parseAllFields(fieldsData) {
        var _fields = '';

        angular.forEach(fieldsData, function (field) {
            var _f, _l, _h;
            
            switch (field.type) {
                case "text":
                case "number":
                case "email":
                case "hidden":
                    field.id = 'input_' + field.id;
                    _f = parseInput(field);
                    break;
                case "textarea":
                    field.id = 'input_' + field.id;
                    _f = parseTextarea(field);
                    break;
                case "radio":
                    _f = parseRadioButtonList(field);
                    break;
                // TODO: add in parsing of the following elements
                case "checkbox":
                case "select":
                case "multiselect":
                    break;
                default:
                    break;
            }

            _h = field.type === "hidden";
            _l = (!_h)
                ? parseLabel(field.id, field.label, field.isRequired)
                : '';

            _fields += parseField(_f, _l, _h);
        });

        return _fields;
    }

    function parsePage() {
        // TODO
    }


    // Public API
    //

    return {

        parse: function (formData) {
            $log.debug(formData);

            return angular
                .copy(formTemplate)
                .replace(/{{title}}/gi, formData.title)
                .replace(/{{description}}/gi, formData.description)
                .replace(/{{fields}}/gi, parseAllFields(formData.fields))
                .replace(/{{submit}}/gi, parseSubmitButton(formData.button.text))
            ;
        }

    }
}
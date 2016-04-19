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

    function parseSectionBreak(data) {
        return '<h2>{{label}}</h2>'
            .replace(/{{label}}/gi, data.label);
    }

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
        return '<textarea name="{{name}}" id="{{id}}" placeholder="{{placeholder}}" value="{{value}}"></textarea>'
            .replace(/{{name}}/gi, data.name)
            .replace(/{{id}}/gi, data.id)
            .replace(/{{value}}/gi, data.value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
        ;
    }

    function parseInput(data) {
        var _hidden = data.type === "hidden";

        return '<input type="{{type}}" name="{{name}}" id="{{id}}" value="{{value}}" required="{{required}}" placeholder="{{placeholder}}" class="{{hidden}}">'
            .replace(/{{type}}/gi, data.type)
            .replace(/{{id}}/gi, data.id)
            .replace(/{{name}}/gi, data.name)
            .replace(/{{value}}/gi, data.value)
            .replace(/{{placeholder}}/gi, data.placeholder)
            .replace(/{{required}}/gi, data.isRequired)
            .replace(/{{selected}}/gi, data.isSelected)
            .replace(/{{hidden}}/gi, _hidden ? 'hidden' : '')
        ;
    }

    function parseGroupInput(data) {
        return '<input type="{{type}}" id="{{id}}" name="{{name}}"  value="{{value}}" {{checked}}>'
            .replace(/{{type}}/gi, data.type)
            .replace(/{{id}}/gi, data.id)
            .replace(/{{name}}/gi, data.name)
            .replace(/{{value}}/gi, data.value)
            .replace(/{{checked}}/gi, !!data.isSelected ? 'checked' : '')
        ;
    }

    function parseGroupInputList(data, startIndex, nameHasIndexSuffix) {
        var
            _l = '<ul>',
            index = startIndex || 0
        ;

        nameHasIndexSuffix = nameHasIndexSuffix === true;

        angular.forEach(data.choices, function (choice) {
            choice.type = data.type;
            choice.id = 'choice_' + data.formId + '_' + data.id + '_' + index;
            choice.name = 'input_' + data.id;

            if (nameHasIndexSuffix) {
                choice.name += '.' + index;
            }

            _l += '<li>'
                    + parseGroupInput(choice)
                    + parseLabel(choice.id, choice.text, false);
                  '</li>';

            index++;
        });

        _l += '</ul>';

        return _l;
    }

    function parseSelectOption(data) {
        return '<option value="{{value}}" {{selected}}>{{text}}</option>'
            .replace(/{{value}}/gi, data.value)
            .replace(/{{selected}}/gi, !!data.isSelected ? 'selected="selected"' : '')
            .replace(/{{text}}/gi, data.text)
        ;
    }

    function parseSelectList(data, isMultiple) {
        var _l = '<select {{multiple}} name="{{name}}" id="{{id}}">';

        isMultiple = isMultiple === true;

        angular.forEach(data.choices, function (choice) {
            _l += parseSelectOption(choice);
        });

        _l += '</select>';

        return _l
            .replace(/{{multiple}}/gi, isMultiple ? 'multiple="multiple"' : '')
            .replace(/{{name}}/gi, data.name)
            .replace(/{{id}}/gi, data.id)
        ;
    }

    function parseSubmitButton(text) {
        return '<button type="submit" ng-disabled="!$ctrl.form.$valid" class="submit">{{text}}</button>'
            .replace(/{{text}}/gi, text || "Submit")
        ;
    }

    function parseField(fieldHTML, labelHTML, isHidden, formId, originalId) {
        return '<li class="field{{hidden}}" id={{id}}>{{label}}{{field}}</li>'
            .replace(/{{hidden}}/gi, isHidden ? ' hidden' : '')
            .replace(/{{id}}/gi, 'field_' + formId + '_' + originalId)
            .replace(/{{label}}/gi, labelHTML)
            .replace(/{{field}}/gi, fieldHTML)
        ;
    }

    function parseAllFields(fieldsData) {
        var _fields = '';

        angular.forEach(fieldsData, function (field) {
            var _f, _l,
                _hidden = false,
                _hasLabel = true,
                _originalId = angular.copy(field.id)
            ;

            switch (field.type) {
                case "text":
                case "number":
                case "email":
                case "hidden":
                    _hidden = field.type !== "hidden";
                    field.id = 'input_' + field.id;
                    field.name = isValidParameterFilter(field.name) ? field.name : field.id;
                    field.value = isValidParameterFilter(field.value) ? field.value: '';
                    _f = parseInput(field);
                    break;
                case "textarea":
                    field.id = 'input_' + field.id;
                    field.name = isValidParameterFilter(field.name) ? field.name : field.id;
                    field.value = isValidParameterFilter(field.value) ? field.value: '';
                    _f = parseTextarea(field);
                    break;
                case "radio":
                    _f = parseGroupInputList(field);
                    break;
                case "checkbox":
                    _f = parseGroupInputList(field, 1, true);
                    break;
                case "select":
                    field.id = 'input_' + field.id;
                    field.name = field.id;
                    _f = parseSelectList(field);
                    break;
                case "multiselect":
                    field.id = 'input_' + field.id;
                    field.name = field.id + '[]';
                    _f = parseSelectList(field, true);
                    break;
                case "html":
                    _hasLabel = false;
                    _f = field.content; // Just render the HTML as-is
                    break;
                case "section":
                    _hasLabel = false;
                    _f = parseSectionBreak(field);
                    break;
                default:
                    break;
            }

            _l = (!_hidden && _hasLabel)
                ? parseLabel(field.id, field.label, field.isRequired)
                : '';

            _fields += parseField(_f, _l, _hidden, field.formId, _originalId);
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
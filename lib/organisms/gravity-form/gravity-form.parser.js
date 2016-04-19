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
      .replace(/{{required}}/gi, required === true ? parseRequiredFlag() : '')
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
    var _hidden = data.type === 'hidden';

    return '<input type="{{type}}" name="{{name}}" id="{{id}}" value="{{value}}" required="{{required}}" placeholder="{{placeholder}}" class="{{hidden}}">'
      .replace(/{{type}}/gi, data.type)
      .replace(/{{id}}/gi, data.id)
      .replace(/{{name}}/gi, data.name)
      .replace(/{{value}}/gi, data.value)
      .replace(/{{placeholder}}/gi, data.placeholder)
      .replace(/{{required}}/gi, data.isRequired)
      .replace(/{{selected}}/gi, data.isSelected)
      .replace(/{{hidden}}/gi, _hidden ? 'ng-hide' : '')
      ;
  }

  function parseGroupInput(data) {
    return '<input type="{{type}}" id="{{id}}" name="{{name}}"  value="{{value}}" {{checked}}>'
      .replace(/{{type}}/gi, data.type)
      .replace(/{{id}}/gi, data.id)
      .replace(/{{name}}/gi, data.name)
      .replace(/{{value}}/gi, data.value)
      .replace(/{{checked}}/gi, data.isSelected === true ? 'checked' : '')
      ;
  }

  function parseGroupInputList(data, startIndex, nameHasIndexSuffix) {
    var _list = '<ul>';
    var _index = startIndex || 0;

    angular.forEach(data.choices, function (choice) {
      choice.type = data.type;
      choice.id = 'choice_' + data.formId + '_' + data.id + '_' + _index;
      choice.name = 'input_' + data.id;

      if (nameHasIndexSuffix === true) {
        choice.name += '.' + _index;
      }

      _list += '<li>'
        + parseGroupInput(choice)
        + parseLabel(choice.id, choice.text, false)
        + '</li>';

      _index += 1;
    });

    _list += '</ul>';

    return _list;
  }

  function parseSelectOption(data) {
    return '<option value="{{value}}" {{selected}}>{{text}}</option>'
      .replace(/{{value}}/gi, data.value)
      .replace(/{{selected}}/gi, data.isSelected === true ? 'selected="selected"' : '')
      .replace(/{{text}}/gi, data.text)
      ;
  }

  function parseSelectList(data, isMultiple) {
    var _list = '<select {{multiple}} name="{{name}}" id="{{id}}">';
    var _isMultiple = isMultiple === true;

    angular.forEach(data.choices, function (choice) {
      _list += parseSelectOption(choice);
    });

    _list += '</select>';

    return _list
      .replace(/{{multiple}}/gi, _isMultiple ? 'multiple="multiple"' : '')
      .replace(/{{name}}/gi, data.name)
      .replace(/{{id}}/gi, data.id)
      ;
  }

  function parseSubmitButton(text) {
    return '<button type="submit" ng-disabled="!$ctrl.form.$valid" class="submit">{{text}}</button>'
      .replace(/{{text}}/gi, text || 'Submit')
      ;
  }

  function parseField(fieldHTML, labelHTML, isHidden, formId, originalId) {
    return '<li class="field{{hidden}}" id={{id}}>{{label}}{{field}}</li>'
      .replace(/{{hidden}}/gi, isHidden ? ' ng-hide' : '')
      .replace(/{{id}}/gi, 'field_' + formId + '_' + originalId)
      .replace(/{{label}}/gi, labelHTML)
      .replace(/{{field}}/gi, fieldHTML)
      ;
  }

  function parseAllFields(fieldsData) {
    var _fields = '';

    angular.forEach(fieldsData, function (field) {
      var _fieldHTML;
      var _labelHTML;
      var _hidden = false;
      var _hasLabel = true;
      var _originalId = angular.copy(field.id);

      switch (field.type) {
        case 'text':
        case 'number':
        case 'email':
        case 'hidden':
          _hidden = field.type === 'hidden';
          field.id = 'input_' + field.id;
          field.name = isValidParameterFilter(field.name) ? field.name : field.id;
          field.value = isValidParameterFilter(field.value) ? field.value : '';
          _fieldHTML = parseInput(field);
          break;
        case 'textarea':
          field.id = 'input_' + field.id;
          field.name = isValidParameterFilter(field.name) ? field.name : field.id;
          field.value = isValidParameterFilter(field.value) ? field.value : '';
          _fieldHTML = parseTextarea(field);
          break;
        case 'radio':
          _fieldHTML = parseGroupInputList(field);
          break;
        case 'checkbox':
          _fieldHTML = parseGroupInputList(field, 1, true);
          break;
        case 'select':
          field.id = 'input_' + field.id;
          field.name = field.id;
          _fieldHTML = parseSelectList(field);
          break;
        case 'multiselect':
          field.id = 'input_' + field.id;
          field.name = field.id + '[]';
          _fieldHTML = parseSelectList(field, true);
          break;
        case 'html':
          _hasLabel = false;
          _fieldHTML = field.content; // Just render the HTML as-is
          break;
        case 'section':
          _hasLabel = false;
          _fieldHTML = parseSectionBreak(field);
          break;
        default:
          break;
      }

      _labelHTML = (!_hidden && _hasLabel)
        ? parseLabel(field.id, field.label, field.isRequired)
        : '';

      _fields += parseField(_fieldHTML, _labelHTML, _hidden, field.formId, _originalId);
    });

    return _fields;
  }

  /*
  // TODO
  function parsePage() {

  }
  */

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

  };
}

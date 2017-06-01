var objectAssign = require('object-assign');

angular
  .module('lnPatterns')
  .factory('lnOGravityFormParser', lnOGravityFormParser);

/**
 *  TODO:
 *    - Render all 'Advanced' fields in the WP GF Form setup
 *    - Render all 'Post' fields in the WP GF Form setup
 *    - Render all 'Pricing' fields in the WP GF Form setup
 *
 *    - Add in paged form support
 *      - Render progress indicator if specified
 *      - Render Submit / Next buttons in page footers and not form footer if paged
 *      - Detect page number and use either Next or Submit button if it's the final page
 */

lnOGravityFormParser.$inject = ['$log', 'isValidParameterFilter', 'isValidObjectAndPropertyFilter'];

function lnOGravityFormParser($log, isValidParameterFilter, isValidObjectAndPropertyFilter) {
  var formTemplate = '' +
    '<div class="ln-o-gravity-form" ng-if="!vm.formSubmitted">' +
    '<div class="ln-o-gravity-form-header">' +
    '<h3 class="title">{{title}}</h3>' +
    '<span class="description">{{description}}</span>' +
    '</div>' +
    '<div class="ln-o-gravity-form-body">' +
    '{{body}}' +
    '</div>' +
    '<div class="ln-o-gravity-form-footer">' +
    '{{submit}}' +
    '</div>' +
    '</div>';

  var methodMap = {
    'text': parseInput,
    'number': parseInput,
    'hidden': parseInput,
    'textarea': parseTextarea,
    'radio': parseGroupInputList,
    'checkbox': parseGroupInputList,
    'select': parseSelectList,
    'multiselect': parseSelectList,
    'html': parseHTML,
    'section': parseSectionBreak,
    'email': parseEmail,
    'page': parsePage //,
    /*
     'name' : parseName,
     'date' : parseDate,
     'time' : parseTime,
     'phone' : parsePhone,
     'address' : parseAddress,
     'website' : parseWebsite,
     'fileupload' : parseFileupload,
     'list' : parseList,
     'post_title' : parsePostTitle,
     'post_content' : parsePostContent,
     'post_excerpt' : parsePostExcerpt,
     'post_tags' : parsePostTags,
     'post_category' : parseCategory,
     'post_image' : parseImage,
     'post_custom_field' : parseCustomField,
     'product' : parseProduct,
     'quantity' : parseQuantity,
     'option' : parseOption,
     'shipping' : parseShipping,
     'total': parseTotal
     */
  };

  // These input types do not need a validation block
  var validationExceptions = ['section', 'page', 'html', 'hidden'];

  // Public API
  //

  return {
    parse: parse
  };

  function parse(data) {
    if (angular.isUndefined(data.response)) {
      $log.error('lnOGravityFormParser.parse() -> Form data unavailable!');
      return;
    }

    return angular
      .copy(formTemplate)
      .replace(/{{title}}/gi, data.response.title)
      .replace(/{{description}}/gi, data.response.description)
      .replace(/{{body}}/gi, parsePages(data.response, data.formName))
      .replace(/{{submit}}/gi, parseSubmitButton(data.response.button.text));
  }


  // Internal
  //


  // Utility

  function parsePages(data, formName) {
    var _html = '';
    var _currentPage;
    var _pageData;

    var _numberOfPages = (isValidObjectAndPropertyFilter(data.pagination, 'pages'))
      ? data.pagination.pages.length
      : 1;

    for (var i = 0; i < _numberOfPages; i++) {
      _currentPage = i + 1;
      _pageData = getPageData(data.fields, _currentPage);
      _html += parseAllFields(_pageData, formName, _currentPage);
    }

    return _html;
  }

  /**
   * Returns a collection of the field data for a specific page number
   * @param data
   * @param pageNumber
   * @returns {*|Array.<T>}
   */
  function getPageData(data, pageNumber) {
    return data.filter(function (field) {
      return field.pageNumber === pageNumber;
    });
  }

  /**
   * Parse all fields on a specific page
   * @param fieldsData
   * @param formName
   * @param pageNumber
   * @returns {string}
   */
  function parseAllFields(fieldsData, formName, pageNumber) {
    var _fields = '<div class="page" data-pageid="' + pageNumber + ' "><ul class="fields">';

    angular.forEach(fieldsData, function (field) {
      var _fieldHTML;
      var _labelHTML;
      var _validationHTML;
      var _descriptionHTML;
      var _method = methodMap[field.type];

      field.hidden = false;
      field.hasLabel = true;

      if (angular.isDefined(_method)) {
        _fieldHTML = _method(field);

        if (isValidParameterFilter(_fieldHTML)) {
          _labelHTML = hasLabel(field)
            ? parseLabel(field.modifiedId, field.label, field.isRequired)
            : '';

          _validationHTML = hasValidationBlock(field)
            ? parseValidationBlock(field, formName)
            : '';

          _descriptionHTML = hasDescription(field)
            ? parseDescription(field.description)
            : '';

          _fields += parseField(_fieldHTML, _labelHTML, _validationHTML, _descriptionHTML, field );
        }
      } else {
        $log.error('lnOGravityFormParser.parseAllFields() -> Unsupported field type: ', field.type);
      }
    });

    _fields += '</ul></div>';

    return _fields;
  }

  /**
   * Parse a single field block
   * @param fieldHTML
   * @param labelHTML
   * @param validationHTML
   * @param descriptionHTML
   * @param isHidden
   * @param formId
   * @param fieldId
   * @returns {string}
   */
  function parseField(fieldHTML, labelHTML, validationHTML, descriptionHTML, data ) {
    var field = objectAssign({
      isHidden: false,
      formId: 0,
      cssClass: '',
      id: 0
    }, data );

    return '<li class="{{className}}" id={{id}}><div class="field-inner">{{label}} {{field}} {{validation}} {{description}}</div></li>'
      .replace(/{{className}}/gi, generateClassName(field))
      .replace(/{{id}}/gi, 'field_' + field.formId + '_' + field.id)
      .replace(/{{label}}/gi, labelHTML)
      .replace(/{{field}}/gi, fieldHTML)
      .replace(/{{validation}}/gi, validationHTML)
      .replace(/{{description}}/gi, descriptionHTML);
  }

  function generateClassName( field ) {
    return 'field {{class}} {{hidden}}'
      .replace(/{{hidden}}/gi, field.isHidden ? ' ng-hide' : '')
      .replace(/{{class}}/gi, field.cssClass )
      .trim();
  }

  function parseOpeningTag(type, params, closeImmediately) {
    var _tag = '<' + type;

    angular.forEach(params, function (value, key) {
      _tag += ' ' + key + '="' + value + '"';
    });

    _tag += '>';

    if (closeImmediately === true) {
      _tag += '</' + type + '>';
    }

    return _tag;
  }

  function parseLabel(isFor, text, required) {
    return '<label for="{{for}}">{{text}}{{required}}</label>'
      .replace(/{{for}}/gi, isFor)
      .replace(/{{text}}/gi, text)
      .replace(/{{required}}/gi, required === true ? parseRequiredFlag() : '');
  }

  function parseRequiredFlag() {
    return '<span>*</span>';
  }

  function parseValidationBlock(data, formName) {
    var _fieldName = data.name || data.id;

    var _params = {
      id: 'validator-' + formName + '-' + _fieldName,
      class: 'validation-block',
      input: data.id
    };

    return parseOpeningTag('div', _params, true);
  }

  function parseDescription(description) {
    return '<div class="description-block">{{description}}</div>'
      .replace(/{{description}}/gi, description);
  }

  function hasValidationBlock(data) {
    for (var i = 0; i < validationExceptions.length; i++) {
      if (data.type === validationExceptions[i]) {
        return false;
      }
    }
    return true;
  }

  function hasLabel(data) {
    return (!data.hidden && data.hasLabel);
  }

  function hasDescription(data) {
    return data.description !== '';
  }


  // Submit / Next button
  //

  function parseSubmitButton(text) {
    return '<button type="submit" ng-disabled="vm.submitDisabled" class="submit">{{text}}</button>'
      .replace(/{{text}}/gi, text || 'Submit');
  }


  // Standard
  //

  function parseInput(data) {
    data.hidden = data.type === 'hidden';
    data.modifiedId = 'input_' + data.formId + '_' + data.id;
    data.name = isValidParameterFilter(data.name) ? data.name : 'input_' + data.id;
    data.type = angular.isDefined(data.enablePasswordInput) && data.enablePasswordInput ? 'password' : data.type;

    var _value;
    if (isValidParameterFilter(data.defaultValue)) {
      _value = data.defaultValue;
    } else if (isValidParameterFilter(data.value)) {
      _value = data.value;
    } else {
      _value = '';
    }

    var _params = {
      type: data.type,
      id: data.modifiedId,
      name: data.name,
      value: _value,
      placeholder: data.placeholder,
      maxlength: data.maxLength > 0 ? data.maxLength : '',
      class: data.hidden ? 'ng-hide' : '',
      'ng-model': 'vm.formModel.' + data.name,
      'ng-required': data.isRequired
    };

    return parseOpeningTag('input', _params);
  }

  function parseTextarea(data) {
    data.modifiedId = 'input_' + data.formId + '_' + data.id;
    data.name = isValidParameterFilter(data.name) ? data.name : 'input_' + data.id;
    data.value = isValidParameterFilter(data.value) ? data.value : '';

    var _params = {
      id: data.modifiedId,
      name: data.name,
      placeholder: data.placeholder,
      value: data.value,
      maxlength: data.maxLength > 0 ? data.maxLength : '',
      'ng-model': 'vm.formModel.' + data.name,
      'ng-required': data.isRequired
    };

    return parseOpeningTag('textarea', _params, true);
  }

  function parseGroupInputList(data) {
    data.modifiedId = 'input_' + data.formId + '_' + data.id;

    var _index = (data.type === 'checkbox') ? 1 : 0;
    var _isCheckbox = (data.type === 'checkbox');

    var _params = {
      id: data.modifiedId,
      'ng-required': data.isRequired
    };

    var _list = parseOpeningTag('ul', _params);

    angular.forEach(data.choices, function (choice) {
      choice.type = data.type;
      choice.modifiedId = 'choice_' + data.formId + '_' + data.id + '_' + _index;
      choice.name = 'input_' + data.id;

      if (_isCheckbox === true) {
        choice.name += '.' + _index;
      }

      _list += '<li>'
        + parseGroupInput(choice)
        + parseLabel(choice.modifiedId, choice.text, false)
        + '</li>';

      _index += 1;
    });

    _list += '</ul>';

    return _list;
  }

  function parseGroupInput(data) {
    var _params = {
      type: data.type,
      id: data.modifiedId,
      name: data.name,
      value: data.value
    };

    var _tag = parseOpeningTag('input', _params);

    if (data.isSelected === true) {
      _tag = _tag.replace(/>/g, 'checked>');
    }

    return _tag;
  }

  function parseSelectList(data) {

    data.modifiedId = 'input_' + data.formId + '_' + data.id;
    data.name = 'input_' + data.id;
    data.isMultiple = data.type === 'multiselect';

    var _params = {
      id: data.modifiedId,
      name: data.name,
      'ng-model': 'vm.formModel.' + data.name,
      'ng-required': data.isRequired
    };

    var _list = parseOpeningTag('select', _params);

    if (data.isMultiple === true) {
      _list = _list.replace(/>/g, 'multiple>');
    }

    // Force placeholder and remove undefined value that is automagically inserted
    // When this is a dropdown select
    _list += '<option style="display:none" value="">' + data.placeholder + '</option>';

    // Now render the actual choices :)
    angular.forEach(data.choices, function (choice) {
      _list += parseSelectOption(choice);
    });

    _list += '</select>';

    return _list;
  }

  function parseSelectOption(data) {
    return '<option value="{{value}}" {{selected}}>{{text}}</option>'
      .replace(/{{value}}/gi, data.value)
      .replace(/{{selected}}/gi, data.isSelected === true ? 'selected' : '')
      .replace(/{{text}}/gi, data.text);
  }

  function parseSectionBreak(data) {
    data.hasLabel = false;
    return '<h2>{{label}}</h2>'
      .replace(/{{label}}/gi, data.label);
  }

  function parseHTML(data) {
    data.hasLabel = false;
    return data.content;
  }

  // Stub method for page input type, as we parse pages based on other data returned from the API
  // But we don't want to have 'unsupported field type' errors in the console
  function parsePage() {
    return '';
  }


  // Advanced

  // NOTE: This is currently implemented as a standard input, but actually has it's own type in the GF Admin,
  // So may need to add in extra logic here.
  function parseEmail(data) {
    return parseInput(data);
  }
}

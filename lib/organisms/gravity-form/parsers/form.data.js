angular
  .module('lnPatterns')
  .factory('lnOGravityFormDataParser', lnOGravityFormDataParser);

/*@ngInject*/
function lnOGravityFormDataParser(isValidParameterFilter) {

  // Public API
  //

  return {
    parse: parse
  };

  function parse(inputs) {
    var _data = {
      'input_values': {}
    };

    var checkboxLists = {};

    if (!inputs || !inputs.length) {
      return _data;
    }

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var name;
      var value;

      if (!isValidParameterFilter(input.name)) {
        continue;
      }

      if (isUnselectedRadioButton(input)) {
        continue;
      }

      switch (input.type) {
        case 'checkbox':
          name = getCheckboxListGroupName(input);
          if (angular.isDefined(checkboxLists[name])) {
            continue;
          }
          checkboxLists[name] = getCheckboxList(name, inputs);
          value = checkboxLists[name];
          break;
        case 'select-multiple':
          name = input.name;
          if (input.multiple) {
            value = angular.element(input).val();
          }
          break;
        default:
          name = input.name;
          value = input.value;
      }

      _data.input_values[name] = value;
    }

    return _data;
  }


  // Internal
  //

  function isUnselectedRadioButton(input) {
    return (input.type === 'radio' && !input.checked);
  }

  function getCheckboxListGroupName(input) {
    return input.name.substring(0, input.name.indexOf('.'));
  }

  function getCheckboxList(groupName, inputs) {
    var _list = inputs.filter(function (item) {
      return item.name.indexOf(groupName) > -1 && item.checked;
    });

    return getListValues(_list);
  }

  function getListValues(list) {
    var _values = [];
    for (var i = 0; i < list.length; i++) {
      _values.push(list[i].value);
    }
    return _values;
  }

}

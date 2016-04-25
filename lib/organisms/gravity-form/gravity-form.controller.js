angular
  .module('lnPatterns')
  .controller('lnOGravityFormController', lnOGravityFormController);

/*@ngInject*/
function lnOGravityFormController($log, $scope, $element, $attrs, $sce, lnOGravityFormService, lnOGravityValidationParser, lnOGravityFormDataParser) {
  var FORM_INPUTS = ['input', 'textarea', 'select', 'datalist', 'keygen'];
  var vm = this;
  var inputs;
  var validationBlocks;


  // Public API
  //

  angular.extend(vm, {
    form: $element[0],
    formData: {},
    submitDisabled: false
  });


  // Internal
  //

  // Added in to address the situation where the service is not configured
  // before the controller is initialised.
  if (angular.isUndefined(lnOGravityFormService.getConfig())) {
    var unbindInit = $scope.$on('lnOGravityFormConfigUpdated', init);
  } else {
    init();
  }

  function init() {
    $log.debug('lnOGravityFormController.init() -> ', vm, '/ $element: ', $element);

    if (angular.isDefined(unbindInit)) {
      unbindInit();
    }

    if (vm.loadFromAPI) {
      lnOGravityFormService.getForm(vm.id)
        .then(_checkLoadFormResponse, _checkLoadFormResponse);
    }

    $element.on('submit', _submit);
    $scope.$on('$destroy', _cleanup);
  }


  // Event Handlers
  //

  function _submit() {

    inputs = getInputElements();
    vm.formData = lnOGravityFormDataParser.parse(inputs);

    $log.debug(vm.formData);

    clearAllValidationBlocks();

    vm.submitDisabled = true;

    lnOGravityFormService
      .submit(vm.id, vm.formData)
      .then(_onSubmitted, _onError);
  }

  function _onSubmitted(response) {
    vm.submitDisabled = false;
    clearInputElements();

    if ($attrs.lnSubmit) {
      vm.onSubmit({response: response});
    }
  }

  function _onError(error) {
    $log.error('lnOGravityFormController._onError()->', error);

    vm.submitDisabled = false;

    if (vm.loadFromAPI) {
      applyValidationErrorMessages(error.data.response.validation_messages);
    }

    if ($attrs.lnError) {
      vm.onError({error: error});
    }
  }

  function _checkLoadFormResponse(response) {
    vm.formHTMLValid = response.data.isValid;
    $scope.formHTML = $sce.trustAsHtml(response.data.html);

    if (vm.formHTMLValid) {
      vm.form.name = response.data.formName;
      vm.form.id = response.data.formId;

      validationBlocks = getValidationBlocks();
    }
  }

  function _cleanup() {
    $element.off('submit', _submit);
  }


  // Utilities
  //

  function getInputElements() {
    var _elements = [];

    for (var i = 0; i < FORM_INPUTS.length; i++) {
      var _inputs = $element.find(FORM_INPUTS[i]);

      if (!_inputs || !_inputs.length) {
        continue;
      }

      for (var j = 0; j < _inputs.length; j++) {
        _elements.push(_inputs[j]);
      }
    }

    return _elements;
  }

  function clearInputElements() {
    angular.forEach(inputs, function (val) {
      val.value = '';
    });
  }

  function getValidationBlocks() {
    return $element[0].getElementsByClassName('validation-block');
  }

  function clearAllValidationBlocks() {
    if (angular.isDefined(validationBlocks)) {
      angular.element(validationBlocks).find('p').detach();
    }
  }

  function getValidationBlockByInputNumber(value) {
    if (angular.isDefined(validationBlocks)) {
      for (var i = 0; i < validationBlocks.length; i++) {
        var block = validationBlocks[i];

        if (block.attributes.input.value === value) {
          return angular.element(block);
        }
      }
    }
  }

  function applyValidationErrorMessages(validationMessages) {
    for (var i in validationMessages) {
      var block = getValidationBlockByInputNumber(i);

      if (angular.isDefined(block)) {
        var _message = lnOGravityValidationParser.parse(validationMessages[i]);
        block.children('p').detach();
        block.append(_message);
      }
    }

  }

}

angular
  .module('lnPatterns')
  .controller('lnOGravityFormController', lnOGravityFormController);

/*@ngInject*/
function lnOGravityFormController($log, $scope, $element, $attrs, $sce, $compile, lnOGravityFormService) {
  var FORM_INPUTS = ['input', 'textarea', 'select', 'datalist', 'keygen'];
  var vm = this;
  var inputs;
  var validationBlocks;

  angular.extend(vm, {
    form: $element[0],
    submitDisabled: false
  });

  // Added in to address the situation where the service is not configured
  // before the controller is initialised.
  if (angular.isUndefined(lnOGravityFormService.getConfig())) {
    var unbindInit = $scope.$on('lnOGravityFormConfigUpdated', init);
  } else {
    init();
  }


  // Bootstrap controller
  //

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
    var data = gatherFormData();

    vm.submitDisabled = true;

    lnOGravityFormService
      .submit(vm.id, data)
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
    applyValidationErrorMessages(error.data.response.validation_messages);

    if ($attrs.lnError) {
      vm.onError({error: error});
    }
  }

  // TODO: Look at compiling in the loaded HTML to the scope properly
  function _checkLoadFormResponse(response) {
    vm.formHTMLValid = response.data.isValid;
    vm.formHTML = $sce.trustAsHtml(response.data.html);

    if (vm.formHTMLValid) {
      vm.form.name = response.data.formName;
      vm.form.id = response.data.formId;

      validationBlocks = getValidationBlocks();

      $log.debug('_checkLoadFormResponse() -> validation blocks: ', validationBlocks);
    }
  }

  function _cleanup() {
    $element.off('submit', _submit);
  }


  // Internal
  //

  function gatherFormData() {
    var formData = {
      'input_values': {}
    };

    inputs = getInputElements();

    if (!inputs || !inputs.length) {
      return formData;
    }

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];

      if (!!input.name && input.name !== '') {

        // Make sure we only get a selected radio button or checkbox
        if ((input.type === 'radio' || input.type === 'checkbox') && !input.checked) {
          continue;
        }

        formData.input_values[input.name] = input.value;
      }
    }

    return formData;
  }

  // TODO: Can probably optimise this
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

  function getValidationBlocks() {
    return $element[0].getElementsByClassName('validation-block');
  }

  // Clear value of object inside input fields after a successful submission
  function clearInputElements() {
    angular.forEach(inputs, function (val) {
      val.value = '';
    });
  }

  function applyValidationErrorMessages(validationMessages) {
    for (var i in validationMessages) {
      $log.debug('lnOGravityFormController.applyValidationErrorMessages() -> ', i, validationMessages[i]);
    }
  }
}

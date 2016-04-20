angular
  .module('lnPatterns')
  .controller('lnOGravityFormController', lnOGravityFormController);

/*@ngInject*/
function lnOGravityFormController($log, $scope, $element, $attrs, $sce, lnOGravityFormService) {
  var FORM_INPUTS = ['input', 'textarea', 'select', 'datalist', 'keygen'];
  var vm = this;
  var inputs;

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

    vm.form.id = 'gform_' + vm.id;

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
    clearInputElements();
    //highlightInputErrors(error.data.response.validation_messages);

    if ($attrs.lnError) {
      vm.onError({error: error});
    }
  }

  function _checkLoadFormResponse(response) {
    vm.formHTMLValid = response.data.isValid;
    vm.formHTML = $sce.trustAsHtml(response.data.html);
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

    if (!!inputs && inputs.length) {
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
    }

    return formData;
  }

  function getInputElements() {
    var _elements = [];

    for (var i = 0; i < FORM_INPUTS.length; i++) {
      var tag = FORM_INPUTS[i];
      var _inputs = $element.find(tag);

      if (!!_inputs && _inputs.length) {
        for (var j = 0; j < _inputs.length; j++) {
          _elements.push(_inputs[j]);
        }
      }
    }

    return _elements;
  }

  // Clear value of object inside input fields after a submission
  function clearInputElements() {
    angular.forEach(inputs, function (val) {
      val.value = '';
    });
  }

  /*
   var highlightInputErrors = function (validationMessages) {
   for (var i in validationMessages) {
   var name = 'input_' + i;
   for (var j = 0; j < inputs.length; j++) {
   if (inputs[j].name === name) {
   if(!!inputs[j].placeholder) {
   inputs[j].placeholder = validationMessages[i];
   }
   continue;
   }
   }
   }
   };
   */
}

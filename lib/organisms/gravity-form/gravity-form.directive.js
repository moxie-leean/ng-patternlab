angular
  .module('lnPatterns')
  .directive('lnOGravityForm', lnOGravityForm);

/**
 * TODO:
 *    - Expand the list of supported input types (see comments in form parser)
 *    - Add in support for confirmation types other than just 'message'
 *    - Add in support for input masks on the client side
 *    - Finish implementing paged support
 */

lnOGravityForm.$inject = ['$compile'];

function lnOGravityForm($compile) {
  return {
    restrict: 'A',
    transclude: true,
    templateUrl: 'lnPatterns/organisms/gravity-form/template.html',
    scope: {},
    controller: 'lnOGravityFormController',
    controllerAs: 'vm',
    bindToController: {
      id: '@lnOGravityForm',
      onSubmit: '&lnSubmit',
      onError: '&lnError',
      loadFromAPI: '=lnLoadFromApi'
    },
    link: function link(scope, element) {
      var unbind = scope.$watch('formHTML', function (newHTML) {
        if (angular.isDefined(newHTML)) {
          var template = angular.element(newHTML);
          
          // If we are using jQuery as a global, we need to unrwap the HTML.
          if (window.$) {
            template = angular.element(newHTML.$$unwrapTrustedValue());
          }
          element.html(template[0]);
          $compile(element.contents())(scope);
        }
      });

      scope.$on('$destroy', function () {
        unbind();
      });
    }
  };
}



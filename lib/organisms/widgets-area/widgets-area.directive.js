angular
  .module('lnPatterns')
  .directive('lnOWidgetsArea', lnOWidgetsArea);

lnOWidgetsArea.$inject = ['$compile'];

function lnOWidgetsArea($compile) {
  return {
    restrict: 'A',
    link: link,
    scope: {
      lnWidgets: '<'
    }
  };

  function link(scope, elem) {
    if (!scope.lnWidgets) {
      return;
    }

    elem.empty();

    angular.forEach(scope.lnWidgets, function(widget, index) {
      var widgetDirective = '<section class="' + widget.class + '" ' + widget.type + ' ln-content="lnWidgets[' + index + '].content"></section>';
      elem.append(widgetDirective);
    });

    $compile(elem.contents())(scope);
  }
}
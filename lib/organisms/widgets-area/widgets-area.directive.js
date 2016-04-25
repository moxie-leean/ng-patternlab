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
      var widgetDirective = '<section class="' + widget.type + '" ' + widget.type; 

      for (var key in widget.params) {
        if (widget.params.hasOwnProperty(key)) {
          var parAttr = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          widgetDirective += ' ' + parAttr + '="lnWidgets[' + index + '].params.' + key + '"';
        }
      }
      
      widgetDirective += '></section>';
      elem.append(widgetDirective);
    });

    $compile(elem.contents())(scope);
  }
}
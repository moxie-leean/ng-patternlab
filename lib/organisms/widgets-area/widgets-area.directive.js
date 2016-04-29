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
      var type = widget.type.replace('lean-', 'ln-m-widget-');
      var widgetDirective = '<section class="' + type + '" ' + type; 

      for (var key in widget.content) {
        if (widget.content.hasOwnProperty(key)) {
          var parAttr = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

          if (parAttr.indexOf('ln-') !== 0) {
            parAttr = 'ln-' + parAttr;
          }

          widgetDirective += ' ' + parAttr + '="lnWidgets[' + index + '].content.' + key + '"';
        }
      }
      
      widgetDirective += '></section>';
      elem.append(widgetDirective);
    });

    $compile(elem.contents())(scope);
  }
}
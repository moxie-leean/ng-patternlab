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
      var type = getWidgetType(widget.type);
      var attrPrefix = (type === widget.type) ? '' : 'ln-';
      var widgetDirective = '<section class="' + type + '" ' + type; 

      for (var key in widget.content) {
        if (widget.content.hasOwnProperty(key)) {
          var parAttr = attrPrefix + key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          widgetDirective += ' ' + parAttr + '="lnWidgets[' + index + '].content.' + key + '"';
        }
      }
      
      widgetDirective += '></section>';
      elem.append(widgetDirective);
    });

    $compile(elem.contents())(scope);
  }

  function getWidgetType(type) {
    switch (type) {
      case 'lean-downloads':
        return 'ln-m-widget-downloads';
      case 'lean-preview':
        return 'ln-m-widget-preview';
      case 'lean-recent':
        return 'ln-m-widget-recent';
      case 'lean-social-links':
        return 'ln-m-widget-social';
      case 'lean-contact-details':
        return 'ln-m-widget-contact';
      case 'lean-menu':
        return 'ln-m-widget-menu';
      default:
        return type;
    }
  }
}
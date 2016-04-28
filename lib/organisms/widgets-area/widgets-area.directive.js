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
      var attrPrefix = (type != widget.type) ? 'ln-' : '';
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
    var widgetType = type;

    switch (type) {
      case 'lean-downloads':
        widgetType = 'ln-m-widget-downloads';
        break;
      case 'lean-preview':
        widgetType = 'ln-m-widget-preview';
        break;
      case 'lean-recent':
        widgetType = 'ln-m-widget-recent';
        break;
      case 'lean-social-links':
        widgetType = 'ln-m-widget-social';
        break;
      case 'lean-contact-details':
        widgetType = 'ln-m-widget-contact';
        break;
      case 'lean-menu':
        widgetType = 'ln-m-widget-menu';
        break;
    }

    return widgetType;
  }
}
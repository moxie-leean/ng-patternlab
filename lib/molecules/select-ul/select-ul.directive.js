angular
  .module('lnPatterns')
  .constant('DEFAULT_DIRECTIVE', 'ln-m-select-ul-item')
  .directive('lnMSelectUl', lnMSelectUl)
  .directive('lnMSelectUlWrapper', lnMSelectUlWrapper)
  .directive('lnMSelectUlItem', lnMSelectUlItem);

/////////////

lnMSelectUl.$inject = ['$timeout', 'DEFAULT_DIRECTIVE'];

function lnMSelectUl( $timeout, DEFAULT_DIRECTIVE ) {
  return {
    restrict: 'E',
    link: link,
    templateUrl: 'lnPatterns/molecules/select-ul/template.html',
    controller: lnMSelectUlController,
    controllerAs: 'vm',
    scope: {
      lnModel: '=',
      lnOptions: '=',
      lnValueField: '@',
      lnLabelField: '@',
      lnPlaceholder: '@',
      lnNone: '@',
      lnMobileNone: '@',
      lnRequired: '@',
      lnItemDirective: '@'
    }
  };

  function link( scope, elem ) {
    scope.valueField = scope.lnValueField ? scope.lnValueField : 'value';
    scope.labelField = scope.lnLabelField ? scope.lnLabelField : 'label';
    scope.required = scope.lnRequired ? scope.lnRequired : false;
    scope.placholder = scope.lnPlaceholder ? scope.lnPlaceholder : '-- Select --';
    scope.none = scope.lnNone ? scope.lnNone : false;
    scope.mobileNone = scope.lnMobileNone ? scope.lnMobileNone : false;
    scope.itemDirective = scope.lnItemDirective ? scope.lnItemDirective : DEFAULT_DIRECTIVE;
    scope.displayOptions = false;

    scope.getSelected = function( field ) {
      var selected = {};

      angular.forEach( scope.lnOptions, checkOption );

      if ( angular.equals({}, selected) ) {
        selected[scope.valueField] = null;
        selected[scope.labelField] = scope.placholder;
      }

      return angular.isDefined( field ) ? selected[ field ] : selected;

      function checkOption( option ) {
        if ( scope.lnModel === option[scope.lnValueField] ) {
          selected = option;
        }
      }
    };

    scope.setSelected = function( index ) {
      scope.lnModel = -1 === index ? null : scope.lnOptions[index][scope.valueField];
      scope.hideOptions();
    };

    scope.toggleOptions = function() {
      scope.displayOptions = !scope.displayOptions;
    };

    scope.hideOptions = function() {
      scope.hidingInProgress = true;
      $timeout(function delayHide() {
        scope.displayOptions = false;
        scope.hidingInProgress = false;
      }, 200);
    };

    scope.showOptions = function() {
      scope.displayOptions = true;
    };
  }
}

/////////////

lnMSelectUlController.$inject = ['$document'];

function lnMSelectUlController($document) {
  var vm = this;

  vm.hasTouchSupport = isTouchSupported() && isMobile();

  function isTouchSupported() {
    var msTouchEnabled = navigator.msMaxTouchPoints;
    var isTouchenabled = 'ontouchstart' in $document[0].createElement('div');
    return msTouchEnabled || isTouchenabled;
  }

  function isMobile() {
    var userAgent = navigator.userAgent;
    var devices = /iPhone|Android|Mobile/;

    return devices.test(userAgent);
  }
}

/////////////

lnMSelectUlWrapper.$inject = ['DEFAULT_DIRECTIVE', '$sanitize', '$compile'];

function lnMSelectUlWrapper( DEFAULT_DIRECTIVE, $sanitize, $compile ) {
  return {
    restrict: 'A',
    link: link,
    scope: {
      lnOption: '='
    }
  };

  function link( scope, elem ) {
    var props = '';

    if ( DEFAULT_DIRECTIVE === scope.$parent.itemDirective ) {
      props = ' ln-label="' + scope.lnOption[scope.$parent.labelField] + '"';
    } else {
      for ( var key in scope.lnOption ) {
        if ( scope.lnOption.hasOwnProperty( key ) ) {
          var parAttr = 'mx-' + normalize( key );

          var value = 
            angular.isObject(scope.lnOption[key])
            ? $sanitize(angular.toJson(scope.lnOption[key]))
            : scope.lnOption[key];

          props += ' ' + parAttr + '="' + value + '"';
        }
      }
    }

    var span = $compile( '<span ' + scope.$parent.itemDirective + props + '></span>' )( scope );
    elem.append( span );
  }

  function normalize( string ) {
    return string.replace( /_/g, '-' ).toLowerCase();
  }
}

/////////////

function lnMSelectUlItem() {
  return {
    restrict: 'A',
    template: '<span ng-bind-html="lnLabel"></span>',
    scope: {
      lnLabel: '@'
    }
  };
}
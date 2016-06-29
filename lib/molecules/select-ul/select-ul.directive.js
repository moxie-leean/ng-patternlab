// require('@iamadamjowett/angular-click-outside');
require( './select-ul-item.directive');

angular
  .module('lnPatterns')
  .directive('lnMSelectUl', lnMSelectUl);


// angular
//   .module('lnSelectToUl', [
//     'angular-click-outside'
//   ])
//   .directive('selectToUl', selectToUl);

lnMSelectUl.$inject = ['$timeout', '$sanitize', '$compile', '$sce'];

function lnMSelectUl( $timeout, $sanitize, $compile, $sce ) {

  return {
    restrict: 'E',
    link: link,
    templateUrl: 'lnPatterns/molecules/select-ul/template.html',
    controller: controller,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
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

    var DEFAULT_DIRECTIVE = 'ln-m-select-ul-item';

    scope.valueField = scope.lnValueField ? scope.lnValueField : 'value';

    scope.labelField = scope.lnLabelField ? scope.lnLabelField : 'label';

    scope.required = scope.lnRequired ? scope.lnRequired : false;

    scope.placholder = scope.lnPlaceholder ? scope.lnPlaceholder : '-- Select --';

    scope.none = scope.lnNone ? scope.lnNone : false;

    scope.mobileNone = scope.lnMobileNone ? scope.lnMobileNone : false;

    scope.itemDirective = scope.lnItemDirective ? scope.lnItemDirective : DEFAULT_DIRECTIVE;

    scope.displayOptions = false;

    scope.$watch( 'lnOptions', compile );

    scope.getSelected = function( field ) {
      var selected = {};

      angular.forEach( scope.lnOptions, checkOption );

      if ( angular.equals({}, selected) ) {
        selected[scope.valueField] = null;
        selected[scope.labelField] = scope.lnPlaceholder;
      }

      return angular.isDefined( field ) ? selected[ field ] : selected;

      function checkOption( option ) {
        if ( scope.ngModel === option[scope.lnValueField] ) {
          selected = option;
        }
      }
    };

    scope.setSelected = function( index ) {
      scope.ngModel = -1 === index ? null : scope.lnOptions[index][scope.valueField];
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

    scope.getOptionHtml = function( option ) {
      var props = '';

      if ( DEFAULT_DIRECTIVE === scope.itemDirective ) {
        props = ' ln-label="' + option[scope.labelField] + '"';
      } else {
        for ( var key in option ) {
          if ( option.hasOwnProperty( key ) ) {
            var parAttr = 'mx-' + normalize( key );

            var value = angular.isObject(option[key]) ? $sanitize(angular.toJson(option[key])) : option[key];

            props += ' ' + parAttr + '="' + value + '"';
          }
        }
      }

      return $sce.trustAsHtml( '<span ' + scope.itemDirective + props + '></span>' );
    };

    function normalize( string ) {
      return string.replace( /_/g, '-' ).toLowerCase();
    }

    function compile() {
      $timeout( compileElem, 2000 );

      function compileElem() {
        $compile( elem[0].querySelector('.desktop li') )( scope );
      }
    }
  }
}


controller.$inject = ['$document'];

function controller($document) {
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

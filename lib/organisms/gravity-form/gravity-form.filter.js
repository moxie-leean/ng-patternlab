angular
  .module('lnPatterns')
  .filter('isValidParameter', isValidParameter)
;

function isValidParameter() {
  return function (param) {
    return param !== ''
      && param !== ' '
      && param !== null
      && angular.isDefined(param);
  };
}

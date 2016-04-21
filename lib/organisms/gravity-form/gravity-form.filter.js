angular
  .module('lnPatterns')
  .filter('isValidParameter', isValidParameter)
  .filter('isValidObjectAndProperty', isValidObjectAndProperty)
;

function isValidParameter() {
  return function (param) {
    return param !== ''
      && param !== ' '
      && param !== null
      && angular.isDefined(param);
  };
}

function isValidObjectAndProperty() {
  return function (item, propertyName) {
    return angular.isObject(item) && angular.isDefined((item[propertyName]));
  };
}

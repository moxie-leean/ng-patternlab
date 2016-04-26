angular
  .module('lnPatterns')
  .filter('isValidParameter', isValidParameter)
  .filter('isValidObjectAndProperty', isValidObjectAndProperty)
  .filter('camelCaseToDashCase', camelCaseToDashCase)
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

function camelCaseToDashCase() {
  return function (str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  };
}

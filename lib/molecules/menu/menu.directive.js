angular
  .module('lnPatterns')
  .directive('lnMMenu', lnMMenu);

lnMMenu.$inject = ['$location', '$state'];

function lnMMenu($location, $state) {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/menu/template.html',
    link: link,
    scope: {
      lnParentClass: '@',
      lnItemClass: '@',
      lnSelParentClass: '@',
      lnSelItemClass: '@',
      lnParentIconClass: '@',
      lnItems: '<'
    }
  };

  function link(scope){
    var urlArray = $location.path().split('/');
    var basePath = urlArray.length > 1 ? urlArray[1] : null;
    var segment = urlArray.length > 2 ? urlArray[2] : null;

    //mark current menu
    angular.forEach(scope.lnItems, function mapItems(item){
      // check if current item is active
      item.class = compareUrl(basePath, item.link) ? (scope.lnSelParentClass || '') : '';

      // check if the current menu has children and if one of them is active
      if (item.items) {
        angular.forEach(item.items, function mapSubItems(subItem){
          subItem.class = compareUrl(segment, subItem.link) ? (scope.lnSelItemClass || '') : '';
        });
      }
    });

    scope.gotoHashURL = function gotoHashURL( item ) {
      var position = item.link.indexOf('#');
      var name = item.link.substr(0, position);
      name = name.replace('/', '');
      var fragment = item.link.substr(position + 1);
      $state.go(name, {
        name: name,
        '#': fragment
      });
    };

  }

  function compareUrl (url, link) {
    return (url && link && link.indexOf(url) > -1);
  }
}

angular
  .module( 'lnPatterns' )
  .directive( 'lnODisqusComments', lnODisqusComments );

lnODisqusComments.$inject = ['$state'];

function lnODisqusComments( $state ) {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/organisms/disqus-comments/template.html',
    link: link,
    scope: {
      lnTitle: '@',
      lnDisqusShortname: '@',
      lnDisqusId: '@',
      lnDisqusTitle: '@'
    }
  };

  function link( scope ) {
    scope.disqusConfig = {
      disqus_shortname: scope.lnDisqusShortname,
      disqus_identifier: scope.lnDisqusId,
      disqus_title: scope.lnDisqusTitle,
      disqus_url: $state.href(
        $state.current.name,
        $state.params,
        {
          absolute: true
        }
      )
    };
  }
}

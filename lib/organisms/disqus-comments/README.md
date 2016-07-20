# Lean Patterns - Organism - Disqus Comments

The component is part of the 'lnPatterns' module.

It will render a Disqus Comments section where used.

## Prerequisites

In order to use this component you must include the following in your project:

An NPM dependency on the [angular-utils-disqus library](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/disqus):

```
npm install angular-utils-disqus
```

Then in your app.js you need to require the library:

```
require( 'angular-utils-disqus' );
```

And add the module dependency to your Angular app:

```
angular
  .module( 'app', [
    'angularUtils.directives.dirDisqus'
  ]);
```

Note: this component also expects you to be using the [ui-router](https://github.com/angular-ui/ui-router) library.

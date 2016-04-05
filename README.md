# Leean Patterns

> An AngularJS module for Lean patterns.


## Getting Started

The easiest way to install this package is by using npm from your terminal:

```
npm install ln-patterns --save-dev
```


## Configuration

TODO


## Build

To generate all the components and templates, just add ln-patterns binary to the postinstall script at your package.json file:

```javascript
{
  ...
  "scripts": {
    "postinstall": "ln-patterns"
  }
  ...
}
```

And run it with the following command:

```
npm run postinstall
```


## Usage

Then you can add the module as a dependency on your AngularJS application:

```javascript
require('ln-patterns');

angular
    .module('app', [
        'lnPatterns'
    ]);
```

And use the components as you need. Here are some examples:

```html
<ln-atom-title1 title="{{vm.title}}" class="{{vm.class}}"></ln-atom-title1>
<ln-atom-title2 title="{{vm.title}}" class="{{vm.class}}"></ln-atom-title2>
```

To see all available components you can setup an AngularJS route to the following template key: **templates/patterns/template.html**, which is also generated automatically by the module when running ln-patterns binary.
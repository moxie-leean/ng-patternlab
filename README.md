# Leean Patterns

> An AngularJS module for Lean patterns.


## Getting Started

The easiest way to install this package is by using npm from your terminal:

```
npm install ln-patterns --save-dev
```


# Usage

Run the lnPatterns gulp task to generate all the components and templates:

```
gulp lnPatterns
```

Then add the module as a dependency to your app:

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

To see all available components you can setup an AngularJS route to the following template key: **templates/patterns/template.html**, which is also generated automatically by the module when running the lnPatterns gulp task.
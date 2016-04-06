# Leean Patterns

> An AngularJS module for Lean patterns.


## Getting Started

The easiest way to install this package is by using npm from your terminal:

```
npm install ln-patterns --save-dev
```


## Configuration

The module tries to load a configuration file at **config/patterns.json** that you have to create inside your application. If that file exists, it will be used to configure the generation of the components and only the components listed at the **enabledComponents** array will be generated. Otherwise all available components at the module will be generated. 

The config file must have the following structure:

```javascript
// config/patterns.json
{
  "generatePatternsPage": true,
  "customComponentsLocation": "../../app",
  "enabledComponents": [
    {
      "component": "atoms/title1",
      "generic": true,
      "examplesParams": [
        {
          "title": "Title 1"
        },
        {
          "title": "Title 1 - Green",
          "class": "green"
        },
        ...
      ]
    },
    {
      "component": "atoms/title2",
      "generic": true,
      "examplesParams": [
        {
          "title": "Title 2 - Blue",
          "class": "blue"
        },
        ...
      ]
    },
    ...
  ]
}
```

If **generatePatternsPage = true**, the module will generate a template page containing all enabled components with their corresponding examples. Each **exampleParams** object of each enabled component will generate a different example in the patterns page, which corresponds to the component instantiated with those parameters.


## Build

To generate the components just add the ln-patterns binary to one of the scripts at your package.json file. Here is an example using **postinstall** script:

```javascript
// package.json
{
  ...
  "scripts": {
    "postinstall": "ln-patterns"
  }
  ...
}
```

And run it with "npm run":

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

And use the components as you need inside your templates. Here are some examples:

```html
<ln-atom-title1 title="{{title}}" class="{{class}}"></ln-atom-title1>
<ln-atom-title2 title="{{title}}" class="{{class}}"></ln-atom-title2>
```

NOTE: To access the patterns page you can setup an AngularJS route to the following template key: **templates/patterns/template.html**. That key is automatically bound to the gererated html on the AngularJS $templateCache.

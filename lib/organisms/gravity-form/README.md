# Lean Patterns - Organism - Gravity Forms

Built on the following tech:
- [AngularJS](https://angularjs.org/)

The component is part of the 'lnPatterns' module, you need to 
```
npm install ln-patterns --save
```

then require it in your site setup:

```
require('ln-patterns');
```
and finally, declare it as a dependency in your Angular app and configure it like so:

```
angular
    .module('app', ['lnPatterns'])
    .config(['$lnOGravityFormConfigProvider', function($lnOGravityFormConfigProvider) {
        $lnOGravityFormConfigProvider.setConfig({
            url: 'http://wp.skaled.moxie-staging.com/gravityformsapi',
            key: 'a53cef0349',
            sigUrl: 'TBC',
            sigCallback: 'TBC'
        });
    });
```

Currently, the only required _genuine_ parameters are 'url' and 'key', 'sigUrl' and 'sigCallback' are placeholders and can contain fake values.

Once you have configured the component, you can use the form directive:

```
<form 
    ln-o-gravity-form="{{vm.formId}}" 
    ln-submit="vm.onFormSubmit(response)" 
    ln-error="vm.onFormError(error)" 
    ln-load-from-api="true|false">
    
    <!-- If ln-load-from-api == "false", the component will NOT attempt to load the form from the API -->
    <!-- and you can put the form content directly in here -->
    
    <!-- If ln-load-from-api == "true", the component will attempt to load and render the form from the API, -->
    <!-- any content you put here will be removed -->
</form>
```

The `ln-submit` and `ln-error` attributes are optional callbacks that are executed when the form is either _successfully_ submitted, or an error occurs and needs handling. In the example above, `vm` is a reference to a parent controller.

If `ln-load-from-api === false`, then you can place your form tags inside the form, for instance:

```
<form 
    ln-o-gravity-form="{{vm.formId}}" 
    ln-submit="vm.onFormSubmit(response)" 
    ln-error="vm.onFormError(error)" 
    ln-load-from-api="false">
    
    <input type="email" name="input_1">
    <input type="submit">
</form>
```

These elements will need to be named correctly (the same as the corresponding elements in form on the WordPress admin site). Please note you must also add the Submit button, though the component will detect when Submit is clicked and trigger the submission process. 

#### NOTE: Currently, 'ln-load-from-api' MUST be set to false as there is a problem with authenticating requests to load forms from the API. If you set this to `true`, a HTML error will be rendered in place of the form.


Responses from the API are forwarded as-per the documentation, so for a successful submission: 

```
data: {
    response: {
        "is_valid": true,
        "page_number": 0,
        "source_page_number": 1,
        "confirmation_message": "this is the confirmation [snipped]"
    },
    status: 200|202
}
```

in the case of a validation failure:

```
data: {
    response: {
        "is_valid": false,
        "validation_messages": {
                    "2": "This field is required. Please enter the first and last name.",
                    "3": "Please enter a valid email address."
        },
        "page_number": 1,
        "source_page_number": 1,
        "confirmation_message": ""
    },
    status: 200|202
}
```

and potential errors:

```
data: {
    response:{
        "code":"form_not_found",
        "message":"Your form could not be found"
    },
    status: 400
}
```
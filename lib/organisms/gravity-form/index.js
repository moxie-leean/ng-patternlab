/**
 * TODOS:
 *
 * Work out approach for authentication:
 *   decide if this:
 *        sigUrl: 'http://www.apitoretrievesignatureurl.com/'
 *   OR this:
 *        sigCallback: pointerToProvidedMethod
 *   is appropriate
 *
 * Comprehensive error handling throughout
 * Parse, form HTML to pass back to controller based on JSON data for rendering in view
 * Highlight invalid fields if form submission fails
 *
 */


require('./gravity-form.provider.js');
require('./gravity-form.transformer.js');
require('./gravity-form.service.js');
require('./gravity-form.controller.js');
require('./gravity-form.directive.js');


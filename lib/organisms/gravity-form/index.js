/**
 * TODOS:
 *
 * Parse, form HTML to pass back to controller based on JSON data for rendering in view
 *
 * Work out approach for authentication:
 *   decide if this:
 *        sigUrl: 'http://www.apitoretrievesignatureurl.com/'
 *   OR this:
 *        sigCallback: pointerToProvidedMethod
 *   is appropriate
 *
 * Comprehensive error handling throughout
 */


require('./gravity-form.provider.js');
require('./gravity-form.transformer.js');
require('./gravity-form.service.js');
require('./gravity-form.controller.js');
require('./gravity-form.directive.js');


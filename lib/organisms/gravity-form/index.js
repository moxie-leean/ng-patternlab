/**
 * TODOS:
 *
 * ENUMS for response codes:
 *      Successful: 200 (OK) or 201 (resource created)
 *      Accepted but unfinished: 202 (accepted)
 *      Illegal or illogical: 400 (bad request)
 *      Unauthenticated or unauthorized: 401 (not authorized)
 *      Requests for non-existent resources: 404 (not found)
 *      Server errors: 500 (server error)
 *      Unsupported requests: 501 (Not implemented)
 *
 * Handle responses from GF Web API (OPTIONAL: build explicit response parser), e.g. :
 *      {
 *          "status": 404,
 *          "response": {
 *              "code": "not_found",
 *              "message": "Entry with ID 414 not found",
 *              "data": 414
 *          }
 *      }
 *
 * Parse and render any form components required by retrieved form config
 *
 * Check input validity
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
require('./gravity-form.service.js');
require('./gravity-form.controller.js');
require('./gravity-form.directive.js');


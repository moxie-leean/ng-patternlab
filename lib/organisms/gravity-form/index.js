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
 * Get form build data/config from Lean Static
 * Render any form components required by retrieved form config
 * Implement gather of values from any ng-transcluded form content and append
 * Format form data in-line with API requirements - (decide where this should go - controller, or service?)
 * Check input validity
 * Add submit dynamically unless already present in transcluded content
 */

require('./gravity-form.service.js');
require('./gravity-form.controller.js');
require('./gravity-form.component.js');

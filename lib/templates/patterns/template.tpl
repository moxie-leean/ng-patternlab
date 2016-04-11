/*** TEMPLATE FOR GENERATING - template.html - WHICH WILL CONTAIN THE PATTERNS PAGE DEFINITION ***/

{COMPONENT}
<!-- {COMPONENT_NAME} -->
<div style="padding: 20px;">
  <h3 style="margin: 10px 0 20px 0"><u>{COMPONENT_NAME}</u></h3>
  <code style="display: block; margin-bottom: 10px;">Description: {COMPONENT_DESCRIPTION}</code>
  <code style="display: block; margin-bottom: 10px;">Params: {COMPONENT_PARAMS}</code>
  <code style="display: block; margin-bottom: 10px;">Usage: {COMPONENT_EXAMPLE}</code>
  <code style="display: block; margin-bottom: 20px;">Examples:</code>
  {EXAMPLE}
  <div style="display: block; margin: 0 50px 10px 50px;" ng-controller="{EXAMPLE_CONTROLLER}">
    <hr/>
    <code style="display: block; margin: 10px 0 10px 0;">Name: {EXAMPLE_NAME}</code>
    <code style="display: block; margin: 10px 0 10px 0;">Params: {EXAMPLE_PARAMS}</code>
    {EXAMPLE_INSTANCE}
  </div>
  {END_EXAMPLE}
</div>
<hr/>
{END_COMPONENT}
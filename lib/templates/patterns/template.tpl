/*** TEMPLATE FOR GENERATING - template.html - WHICH WILL CONTAIN THE PATTERNS PAGE DEFINITION ***/

<div style="width: 100%;" ng-controller="lnPatternsController">
  <div style="color: #222; background: #fff; top: 0; left: 0; overflow-y: scroll; overflow-x: hidden; position: fixed; white-space: nowrap; width: 20%; font: 1em/1.7 'Helvetica Neue',Helvetica,Arial,sans-serif; height: 70%;">
    <div>
      <input type="color" ng-model="color" style="border: 2px solid transparent; border-radius: 0px; width: 100%; height: 30px; padding: 3px;">
      <h2 style="margin-top: 5px; margin-bottom: 10px; padding: 0 10px; font-size: 15pt;"><code style="font-weight: 400; font-family: Consolas,Courier New,monospace;">Atoms:</code></h2>
      <ul style="margin-top: 0; padding: 0 10px; margin-left: 2em;">
        {ATOM_LINK}
        <li style="list-style-type: none; margin: 0 0 0 -.9em;">
          <a href="#/patterns#{LINK_ID}" style="color: #6495ED; border-bottom: 1px solid #ddd; text-decoration: none;">
            <code style="font-family: Consolas,Courier New,monospace;">{LINK_NAME}</code>
          </a>
        </li>
        {END_ATOM_LINK}
      </ul>
      <h2 style="margin-top: 5px; margin-bottom: 10px; padding: 0 10px; font-size: 15pt;"><code style="font-weight: 400; font-family: Consolas,Courier New,monospace;">Molecules:</code></h2>
      <ul style="margin-top: 0; padding: 0 10px; margin-left: 2em;">
        {MOLECULE_LINK}
        <li style="list-style-type: none; margin: 0 0 0 -.9em;">
          <a href="#/patterns#{LINK_ID}" style="color: #6495ED; border-bottom: 1px solid #ddd; text-decoration: none;">
            <code style="font-family: Consolas,Courier New,monospace;">{LINK_NAME}</code>
          </a>
        </li>
        {END_MOLECULE_LINK}
      </ul>
      <h2 style="margin-top: 5px; margin-bottom: 10px; padding: 0 10px; font-size: 15pt;"><code style="font-weight: 400; font-family: Consolas,Courier New,monospace;">Organisms:</code></h2>
      <ul style="margin-top: 0; padding: 0 10px; margin-left: 2em;">
        {ORGANISM_LINK}
        <li style="list-style-type: none; margin: 0 0 0 -.9em;">
          <a href="#/patterns#{LINK_ID}" style="color: #6495ED; border-bottom: 1px solid #ddd; text-decoration: none;">
            <code style="font-family: Consolas,Courier New,monospace;">{LINK_NAME}</code>
          </a>
        </li>
        {END_ORGANISM_LINK}
      </ul>
      <h2 style="margin-top: 5px; margin-bottom: 10px; padding: 0 10px; font-size: 15pt;"><code style="font-weight: 400; font-family: Consolas,Courier New,monospace;">Templates:</code></h2>
      <ul style="margin-top: 0; padding: 0 10px; margin-left: 2em;">
        {TEMPLATE_LINK}
        <li style="list-style-type: none; margin: 0 0 0 -.9em;">
          <a href="#/patterns#{LINK_ID}" style="color: #6495ED; border-bottom: 1px solid #ddd; text-decoration: none;">
            <code style="font-family: Consolas,Courier New,monospace;">{LINK_NAME}</code>
          </a>
        </li>
        {END_TEMPLATE_LINK}
      </ul>
    </div>
  </div>
  <div style="color: #222; background: #fff; top: 0; right: 0; overflow-y: scroll; overflow-x: hidden; position: fixed; white-space: nowrap; width: 80%; font: 1em/1.7 'Helvetica Neue',Helvetica,Arial,sans-serif; height: 70%;">
    <div style="padding: 20px;">
      {COMPONENT}
      <!-- {COMPONENT_NAME} -->
      <div style="border: 1px solid #d3d3d3; border-top: 0; margin-bottom: 30px;">
        <h3 style="background: #6d426d; box-shadow: 0 .25em .5em #d3d3d3; border-top: 1px solid #d3d3d3; border-bottom: 1px solid #d3d3d3; margin: .5em 0; padding: .75em 0 .75em 10px; position: relative; font-size: 15pt;">
          <a id="{COMPONENT_ID}"></a>
          <code style="color: #eee; font-family: Consolas,Courier New,monospace; font-weight: 400;">{COMPONENT_NAME}</code>
        </h3>
        <p style="padding: 10px 10px 0 10px; margin-bottom: 10px;">{COMPONENT_DESCRIPTION}</p>
        <h4 style="padding: 0 10px; font-weight: 600;">Parameters:</h4>
        <pre style="margin: 0; padding: .5em 10px; border-top: 1px solid #ddd; color: #333; background: #f7f7f7; overflow-x: scroll; font-family: monospace; white-space: pre; line-height: 15px;">
          <code style="display: block; font-family: Consolas,Courier New,monospace;">{COMPONENT_PARAMS}</code>
        </pre>
        <h4 style="padding: 0 10px; font-weight: 600;">Usage:</h4>
        <pre style="margin: 0; padding: .5em 10px; border-top: 1px solid #ddd; color: #333; background: #f7f7f7; overflow-x: scroll; font-family: monospace; white-space: pre; line-height: 15px;">
          <code style="display: block; font-family: Consolas,Courier New,monospace;" ng-non-bindable>{COMPONENT_EXAMPLE}</code>
        </pre>
        <h4 style="padding: 0 10px; font-weight: 600;">Examples:</h4>
        {EXAMPLE}
        <p style="padding: 0 10px 0 10px; margin-bottom: 10px;">
          <a href="" ng-click="changeExample('{EXAMPLE_ID}')" style="color: #6495ED; border-bottom: 1px solid #ddd; text-decoration: none;">{EXAMPLE_NAME}</a>
        </p>
        <pre style="margin: 0; padding: .5em 10px; border-top: 1px solid #ddd; color: #333; background: #f7f7f7; overflow-x: scroll; font-family: monospace; white-space: pre; line-height: 15px;">
          <code style="display: block; font-family: Consolas,Courier New,monospace;">{EXAMPLE_PARAMS}</code>
        </pre>
        {END_EXAMPLE}
      </div>
      {END_COMPONENT}
    </div>
  </div>
  <div style="bottom: 0; left: 0; overflow: hidden; position: fixed; width: 100%; height: 30%; overflow-x: hidden; border-top: 2px solid #ddd;">
    <iframe ng-src="{{currentExampleUrl}}" width="100%" height="98%" scrolling="auto" style="border: 0;" ng-style="{'background-color': color}"></iframe>
  </div>
</div>
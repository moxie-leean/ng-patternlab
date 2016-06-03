# Lean Patterns - Organism - Flexible Content

The component is part of the 'lnPatterns' module.

It is designed to work with the ACF flexible content type. It renders an array of sections, choosing the directive to use for each based on the acf_fc_layout property value. It expects the data to be in the following format:

```
[
    {
        "acf_fc_layout": "text_image",
        "text": "<p>Some text</p>\n",
        "image": "http://rooomy.dev/wp-content/uploads/2016/06/DSCN0018_740x740_acf_cropped.jpg",
        "image_caption": "Info about this image."
    },
    {
        "acf_fc_layout": "3d_viewer",
        "3d_viewer_url": "http://abc.com"
    }
]
```

The `acf_fc_layout` is required for each section. It will look for an `mx` (your app) version of the directive first, if it doesn't exist it will fallback to the `ln` (pattern lab) version. Directives are assumed to be organisms and _'s are converted to -'s. For example:

- When acf_fc_layout = "text_image" it will look for a directive called `mx-o-text-image`. If not found it will look for `ln-o-text-image`. 

Parameters are passed into the directive with the same mx or ln prefix and the same _ to - conversion. For example:

- The property "image_caption": "Info about this image." will render as `mx-image-caption="Info about this image."`. Or `ln-image-caption="Info about this image."` in the case that the Patternlab version is used.

Putting it all together, the first row above will render and compile the following HTML (assuming the mx directive exists):

```
<section class="mx-o-text-image" 
         mx-o-text-image="" 
         mx-acf-fc-layout="text_image"
         mx-text="<p>Some text</p>"
         mx-image="http://rooomy.dev/wp-content/uploads/2016/06/DSCN0018_740x740_acf_cropped.jpg"
         mx-image-caption="Info about this image.">
</section>
``` 

In this way you can re-use any directive within a flexible content row.

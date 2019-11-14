# jfield - A jQuery Plugin for creating and handling dynamic stylable inputs  

I made this plugin because I was using jQuery to build dynamic filters and inputs, and ended up needing a better way to create uniform inputs which I could style how I wanted.  
In the example provided in `index.html`, I used the [Free FontAwesome](https://fontawesome.com/) to add icons to checkboxes and radio buttons.  
  
Requires:  

- Requires jQuery (Made with jQuery 3.4.1)

Comes with:  

- Basic CSS, copy certain rules to add your own styles!  
- jQuery plugin script.  

## Examples

### Initialise a field

Most inputs share a similar structure for initialisation.  

```javascript
$('.selector').jfield('text', {
    attrs: {name: '', id: '', ...},
    preset: '',
    label: '',
    value: '',
});
```

When initialising a jfield, the plugin takes two parameters.  

- A field type from `text, number, checkbox, radio, dropdown, button`  
- An options object `{}`  

Within the options object, the following values can be provided:

- `attrs` (Optional) Object of attribute name and value to add to the input within the jfield. Usually this would contain at least a `name` field, but for single inputs, an `id` could be useful for any extra functionality you might have.
- `preset` (Optional) String or Boolean, depending on the field type. String values are assigned to any input which is capable of holding a text/number value, in the case of radio/checkbox, the value of `preset` is made to a Boolean to determine if the input starts as checked.
- `label` (Optional, but recommended) String label to attach to the input. For radio/checkbox, this is _STRONGLY_ recommended, since the input tends to not display its value. Text fields and dropdown elements can make use of the `attr` value `placeholder` in place of a label, to display context within an empty input.
- `value` (Conditionally required) For checkbox/radio inputs, this is a requirement, since otherwise there won't be a value for the input. Dropdowns require a list (Array) of values otherwise they will have no options. For a button, value can act as a label, since input values on button inputs tend to display on the button element itself.

### Get the values of fields

Getting the values of fields is made much simpler as well!  
Instead of jumping around grabbing specific elements by ids or having to monitor all the fields around, you can simply call once on a parent of _ALL_ fields, and a handy `key: value` object will be returned to you with the contents of all editable fields! (Buttons are _NOT_ included since they don't tend to update values. Note: An option may be added to change this.)

```javascript
$('.selector').jfield('getValue');
// {inputName: inputValue}

$('.parent').jfield('getValue');
// {name1: value1, name2: value2, ...}
```

## Thoughts for additions

- Allow radio/checkbox inputs to have a list of values, so that a collection of them can be made at once, as you would usually expect/want, and change the preset to allow for a specific radio/check to be enabled.  
- Add an option to `getValue` to allow button values to be collected as well if the user desires!

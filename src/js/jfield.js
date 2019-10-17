/**
 * Using jQuery to do some field stuff.
 * Requires jquery ui for dropdowns!
 * 
 * jField interactions:
 * `action == 'text'|'number'|'checkbox'|'radio'|'dropdown'|'button'`
 *  Create a new field within this element.
 *  In this context, `options` should contain: 
 *      `value` key, relevant to the type of values the field should have set. 
 *      (Usually string, although the dropdown requires an array.)
 *      `attrs` key, relevant to attributes that can be applied to an element.
 *      (Inc. id, name, etc. Value will be removed.)
 *      `preset` key, to set the field to a specified value on creation.
 * 
 * `action == 'get'`
 *  Get a value from one or more jfield elements in the parent.
 *  Returned as array of objects.
 *  `options` can be a string name, or array of string names to filter which
 *  fields are retrieved. No option is all fields.
 * 
 * `action == 'set'`
 *  Set a value for one or more jfield elements in the parent.
 *  If a value cannot be set to, or doesn't match an available input,
 *  it will be ignored.
 *  `options` should be the value.
 */
var jFieldDefaults = {
    text: {
        attr: {
            class: 'text',
            placeholder: '',
        },
    },
    number: {
        attr: {
            class: 'number',
            min: -1000,
            max: 1000,
            step: 1,
        },
    },
    checkbox: {
        attr: {
            class: 'checkbox',
            checked: false,
        },
        content: 'X',
    },
    radio: {
        attr: {
            class: 'radio',
            checked: false,
        },
        content: '',
    },
    dropdown: {
        attr: {
            class: 'dropdown',
        },
        initial: '',
    },
    button: {
        attr: {
            class: 'button',
        },
    },
};

(function($) {

    function _container() {  // Basic parent
        return $("<div class=\"jfield\"></div>");
    };

    function createText() {  // Text element
        var $container = _container(),
        $text = $("<input type=\"text\">");

        $text.css(jFieldDefaults.text.attr);
        return $container.append($text);
    };
    function createNumber() {  // Number element
        var $container = _container(),
        $num = $("<input type=\"number\">");

        $num.css(jFieldDefaults.number.attr);
        return $container.append($num);
    };
    function createCheckbox() {  // Checkbox element
        var $container = _container(),
        $check = $("<input type=\"checkbox\">");

        $check.css(jFieldDefaults.checkbox.attr);
        return $container.append($check);
    };
    function createRadio() {  // Radio element
        var $container = _container(),
        $radio = $("<input type=\"radio\">");

        $radio.css(jFieldDefaults.radio.attr);
        return $container.append($radio);
    };
    function createDropdown() {  // Dropdown element
        var $container = _container(),
        $drop = $("<input type=\"text\" readonly>");

        $drop.css(jFieldDefaults.drop.attr);
        return $container.append($drop);
    };
    function createButton() {  // Button element
        var $container = _container(),
        $button = $("<input type=\"button\">");

        $button.css(jFieldDefaults.button.attr);
        return $container.append($button);
    };

    function setValue(value) {};
    function getValue(fields) {};


    $.fn.jfield = function(action, options) {
        /**
         * 
         */
        return this.each(function(i, el) {
            switch (action) {
                case "": 
                    break;
                case "":
                    break;
                default: 
                    console.warn("Unrecognised action: " + action);
            }
        });
    };

})(jQuery);
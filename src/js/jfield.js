/**
 * Using jQuery to do some field stuff.
 * Requires jquery ui for dropdowns!
 * 
 * jField interactions:
 * `action == 'text'|'number'|'checkbox'|'radio'|'dropdown'|'button'`
 *  Create a new field within this element.
 *  In this context, `options` should contain: 
 *      `value` key, relevant to the values the field should have set. 
 *      (Usually string, although the dropdown requires an array. Text/Number fields ignore this)
 *      `attrs` key, relevant to attributes that can be applied to an input.
 *      (Inc. id, name, etc. Type & Value will be removed.)
 *      `preset` key, to set the field to a specified value on creation. 
 *      (True/False for checkbox/radio, string to prefill others)
 *      `label` key, to determine if a label is displayed. 
 *      (Either false for no label, or string label to display)
 * 
 * `action == 'getValue'`
 *  Get a value from one or more jfield elements in the parent.
 *  Returned as array of objects.
 *  `options` can be a string name, or array of string names to filter which
 *  fields are retrieved. No option is all fields.
 * 
 * `action == 'setValue'`
 *  Set a value for one or more jfield elements in the parent.
 *  If a value cannot be set to, or doesn't match an available input,
 *  it will be ignored.
 *  `options` should be the value.
 * 
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
        initial: '',
    },
    button: {
        attr: {
            class: 'button',
        },
    },
};

(function($) {

    // function holder
    var fn = {
        // Base container
        _container: function() {  // Basic parent
            return $("<div class=\"jfield\"></div>");
        },
        // Main container
        createText: function() {  // Text element
            var $container = fn._container(),
            $text = $("<input type=\"text\">");
    
            $text.css(jFieldDefaults.text.attr);
            return $container.append($text);
        },
        createNumber: function () {  // Number element
            var $container = fn._container(),
            $num = $("<input type=\"number\">");
    
            $num.css(jFieldDefaults.number.attr);
            return $container.append($num);
        },
        createCheckbox: function() {  // Checkbox element
            var $container = fn._container(),
            $check = $("<input type=\"checkbox\">");
            $display = $("<div class=\"checkbox\"></div>"),
            def = jFieldDefaults.checkbox;
    
            // Display element
            $display.append("<span></span>");
            if (jFieldDefaults.checkbox.content) {
                $display.find("span").text(def.content);
            }
    
            // checkbox attr
            $check.css(def.attr);
    
            $display.append($check);
            return $container.append($display);
        },
        createRadio: function() {  // Radio element
            var $container = fn._container(),
            $radio = $("<input type=\"radio\">");
    
            $radio.css(jFieldDefaults.radio.attr);
            return $container.append($radio);
        },
        createDropdown: function() {  // Dropdown element
            var $container = fn._container(),
            $drop = $("<input type=\"text\" readonly>");
    
            $drop.css(jFieldDefaults.drop.attr);
            return $container.append($drop);
        },
        createButton: function() {  // Button element
            var $container = fn._container(),
            $button = $("<input type=\"button\">");
    
            $button.css(jFieldDefaults.button.attr);
            return $container.append($button);
        },
        // Events
        checkToggle: function(evt) {
            var $checkbox = $(this).find(".checkbox");
                            
            $checkbox.toggleClass("active");
    
            var active = $checkbox.hasClass("active");
            var checked = $checkbox.find("input").is(":checked");
            
            if (active && !checked) {
                $checkbox.find("input").prop('checked', true).trigger("change");
            } else if (!active && checked) {
                $checkbox.find("input").prop('checked', false).trigger("change");
            }
        },
    },
    setup = {
        // Elements
        text: function($parent, options) {
            var $field = fn.createText();
            // attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass("text");
    
            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.append($label);
            }
            // preset
            if (options.preset) {
                // enforces String on option
                // WARNING: this will cast objects to string without care
                $field.find("input").val(String(options.preset));
            }

            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });

            // Add to element
            $parent.append($field);
        },
        number: function($parent, options) {
            var $field = fn.createNumber();
            // attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass("number");
    
            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.append($label);
            }
            // preset
            if (options.preset) {
                // enforces Number, ignoring NaN values for preset
                if (!isNaN(Number(options.preset)))
                    $field.find("input").val(Number(options.preset));
            }

            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });

            // Add to element
            $parent.append($field);
        },
        checkbox: function($parent, options) {
            var $field = fn.createCheckbox();
            // Set our value for this check
            $field.find("input").val(options.value);
    
            // custom attr
            setattr($field.find('input'), options.attrs);
            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.append($label);
            }
            // preset value
            if (options.preset) {
                $field.find('input').prop('checked', true);
                $field.find('.checkbox').addClass("active");
            }
    
            // events
            $field.on("click", fn.checkToggle);
            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });
    
            // Add to element
            $parent.append($field);
        },
        radio: function($parent, options) {  // WIP
        
        },
        dropdown: function($parent, options) {  // WIP
            
        },
        button: function($parent, options) {
            var $field = fn.createButton();
            // Set our value for this check
            $field.find("input").val(options.value);

            // Custom attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass("button");

            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.append($label);
            }

            // events
            $field.find("input").on("click", function() {
                $field.trigger("field-updated");
            });

            // Add to element
            $parent.append($field);
        },
    };

    // attr
    function setattr($el, attrs) {
        /**
         * Set the given `attrs` to `$el`, but
         * don't override any `value` or `type`.
         */
        if (!attrs) return;

        if (attrs.type) delete attrs.type;
        if (attrs.value) delete attrs.value;

        $el.attr(attrs);
    };

    // set / get
    function setValue(value) {};
    function getValue(fields) {};


    // plugin
    $.fn.jfield = function(action, options) {
        return this.each(function(i, el) {
            switch (action) {
                case "text":  // Create text field
                    setup.text($(this), options);
                    break;
                case "number":  // Create number field
                    setup.number($(this), options);
                    break;
                case "checkbox":  // Create checkbox field
                    setup.checkbox($(this), options);
                    break;
                case "radio":  // Create radio field
                    break;
                case "dropdown":  // Create dropdown/select field
                    break;
                case "button":  // Create button
                    setup.button($(this), options);
                    break;
                case "setValue":  // Set a value
                    break;
                case "getValue":  // Get the value (json style)
                    break;
                default: 
                    console.warn("Unrecognised action: " + action);
            }
        });
    };

})(jQuery);
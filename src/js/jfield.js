/**
 * Using jQuery to do some field stuff.
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
        },
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
        attr: {
            class: 'dropdown',
        },
        menu: {
            attr: {
                class: 'dropdown-menu',
            }
        }
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
            $check = $("<label><input type=\"checkbox\"><span></span></label>");
            def = jFieldDefaults.checkbox;
    
            // checkbox attr
            $check.attr(def.attr);
    
            return $container.append($check);
        },
        createRadio: function() {  // Radio element
            var $container = fn._container(),
            $radio = $("<label><input type=\"radio\"><span></span></label>");
    
            $radio.attr(jFieldDefaults.radio.attr);
            return $container.append($radio);
        },
        createDropdown: function() {  // Dropdown element
            var $container = fn._container(),
            $drop = $("<input type=\"text\" readonly>");
    
            $drop.css(jFieldDefaults.dropdown.attr);
            return $container.append($drop);
        },
        createButton: function() {  // Button element
            var $container = fn._container(),
            $button = $("<input type=\"button\">");
    
            $button.css(jFieldDefaults.button.attr);
            return $container.append($button);
        },
        // Events
        openDrop: function($input, values) {
            if (!Array.isArray(values)) return;

            var cls = jFieldDefaults.dropdown.menu.attr.class;
            var hasmenu = ($input.parent().find('.'+cls).length > 0);

            if (hasmenu)
                $menu = $input.parent().find('.'+cls);
            else
                $menu = $("<div></div>");

            if (!hasmenu) {
                $menu.attr(jFieldDefaults.dropdown.menu.attr)
                    .css({
                        'position': 'absolute', 
                        'top': $input.outerHeight() + 2,
                        'width': $input.innerWidth(),
                        'z-index': 100,
                    }).append("<ul></ul>");

                // Add values
                for (var i=0; i<values.length; i++) {
                    var value = String(values[i]);
                    $menu.find("ul").append("<li>" + value + "</li>");
                }

                // events
                $menu.find("li").on("click", function() {
                    var value = $(this).text();
                    $input.val(value);
                    $input.trigger("change");
                });

                $input.parent().append($menu);
            } else {
                $menu.show();
            }

            // body once to close
            var bodyClick = function(evt) {
                var cls = jFieldDefaults.dropdown.attr.class;
                if (!$(evt.target).hasClass(cls))
                    $menu.hide();
            };
            $("body").off("click", bodyClick);
            $("body").on("click", bodyClick);
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
                $field.find("label").append(String(options.label));
            } else {
                $field.find("label").append(String(options.value));
            }

            // preset value
            if (options.preset) {
                $field.find('input').prop('checked', true);
            }
    
            // events
            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });
    
            // Add to element
            $parent.append($field);
        },
        radio: function($parent, options) {
            var $field = fn.createRadio();
            // Set our value for this check
            $field.find("input").val(options.value);
    
            // custom attr
            setattr($field.find('input'), options.attrs);
            // label
            if (options.label) {
                $field.find("label").append(String(options.label));
            } else {
                $field.find("label").append(String(options.value));
            }

            // preset value
            if (options.preset) {
                $field.find('input').prop('checked', true);
            }
    
            // events
            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });
    
            // Add to element
            $parent.append($field);
        },
        dropdown: function($parent, options) {  // TODO: Tweak position
            var $field = fn.createDropdown();
            // custom attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass("dropdown");

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
                if (options.value.indexOf(options.preset) > -1)
                    $field.find("input").val(options.preset);
            }

            // Custom clicks and menu
            $field.find("input").on("click", function() {
                fn.openDrop($(this), options.value);
            });

            // events
            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });
    
            // Add to element
            $parent.append($field);
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
    function setValue($elem, value) {
        // Setting values
        $elem.find(".jfield").each(function() {
            var ftype = $(this).find("input").attr("type");
            
            if (ftype === "checkbox" || ftype === "radio") {
                // Set on radio/check means select it.
                var checked = $(this).find("input").is(":checked");
                if ((!!value && !checked) || (!value && checked))
                    $(this).find("input").trigger("click");
            } else if (ftype === "text" || ftype === "number") {
                // Set on text/number means insert value. (Dropdown gets hard set)
                if (ftype === "number" && isNaN(Number(value))) return;
                $(this).find("input").val(value);
            } else if (ftype === "button") {
                // Set on button triggers a click.
                $(this).find("input").trigger("click");
            }
        });
    };
    function getValue($elem) {
        /**
         * Return an object of values for all the
         * jfields in the selector.
         */
        var j = {};
        $elem.find(".jfield").each(function(i, el) {
            var $input = $(this).find("input");
            var inputtype = $input.attr("type");
            var inputname = $input.attr("name");

            if (inputtype == "button") {
                return;
            } else if (inputtype == "radio" || inputtype == "checkbox") {
                if ($input.is(":checked")) {
                    j[inputname] = $input.val();
                }
            } else {
                j[inputname] = $input.val();
            }
        });
        return j;
    };
    // plugin
    $.fn.jfield = function(action, options) {
        switch (action) {
            case "setValue":  // Set a value
                setValue($(this), options);
                break;
            case "getValue":  // Get the value (json style)
                return getValue($(this));
            default:
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
                            setup.radio($(this), options);
                            break;
                        case "dropdown":  // Create dropdown/select field
                            setup.dropdown($(this), options);
                            break;
                        case "button":  // Create button
                            setup.button($(this), options);
                            break;
                        default: 
                            console.warn("Unrecognised action: " + action);
                    }
                });
        }
    };
})(jQuery);
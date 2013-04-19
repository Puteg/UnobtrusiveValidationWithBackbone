/// <reference path="../Scripts/underscore.js" />
/// <reference path="../Scripts/backbone.js" />

this.App = this.App || { Lib: {} };
this.App.Lib = this.App.Lib || {};

!function (lib) {

    var createDef = function (def, attr, error) {
        var done = function (attr) {
            alert("valid " + attr);
        };
        var fail = function (d, s) {
            alert("invalid " + attr + " :" + (error || s));
        };

        def = def || $.Deferred();
        def.done(done).fail(fail);

        if (!error)
            def.resolve && def.resolve(attr);
        else
            def.reject && def.reject(attr, error);

    };


    var defaultPatterns = {
        // Matches any digit(s) (i.e. 0-9) - цифры
        digits: /^\d+$/,

        // Matched any number (e.g. 100.000)
        number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

        // Matches a valid email address (e.g. mail@example.com)
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

        // Mathes any valid url (e.g. http://www.xample.com)
        url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    };



    var rules = lib.rules = {
        required: function (attr, value, options, model) {
            var result;
            if (options)
                result = !!value ? undefined : getMesError("обязательное поле", options);
            return createDef(null, attr, result);
        },
        eq: function (attr, value, options) {
            return value === options.value ? undefined : getMesError("должно быть равно " + options.value, options);
        },
        number: function (attr, value, options) {
            var r = (_.isNumber(value) || (_.isString(value) && value.match(defaultPatterns.number))) ? undefined : options.msg;
            return createDef(null, attr, r);

        },
        length: function (attr, value, options) {
            if (_.isString(value)) {
                var l = value.length;
                if (l > options.max || l < options.min)
                    return options.msg;
                else
                    return;
            }
            return options.msg;
        },

        remote: function (attr, value, options, model) {
            return createDef($.ajax({
                mode: 'abort',
                type: options.type || 'GET',
                url: options.url,
                data: model.toJSON(),
                error: function (d, s) {
                    model.trigger('validated validated:invalid', attr, false, $(d.responseText).filter('title').text());
                },
                success: function (d, s) {
                    model.trigger('validated validated:valid', attr, true);
                }
            }), attr);
        },
    };
    lib.addRules = function (name, rule) {
        rules[name] = rule;
    };
    var addError = function (error, attr, mes) {
        if (!mes)
            return error;
        error = error || {};
        error[attr] = error[attr] || [];
        error[attr].push(mes);
        return error;
    };

    var getMesError = function (mes, options) {
        return options.msg ? options.msg : mes;
    };

    var base = Backbone.Model.prototype;
    lib.ValidModel = Backbone.Model.extend({
        remote: true,
        rules: rules,
        validation: {
            name: {
                'required': true,
                'eq': {
                    value: 'qwert',
                    msg: "только  =  qwert",
                },
                //'remote': {
                //    type: 'POST',
                //    url: '/valid/remote/',
                //}
            },
            id: {
                'number': { msg: "это не число..." },
                'remote': {
                    type: 'POST',
                    url: '/valid/remote/890',
                }
            }
        },

        initialize: function (attrs, options) {
            this.on('change', this.changeValidate, this);
            this.on('validated:invalid', function (attr, errors) {
            }, this);
            this.on('validated', function (attr, isValid, errors) {
                !isValid && $('body').append('<p>' + errors + '</p>');
            }, this);
            this.on('invalid', function (a, f, d) {
            }, this);
        },

        validate: function (attrs, options) {
            return this._attrsValidate(attrs, options);
        },

        changeValidate: function (model, options) {
            if (options.changeValidate) {
                delete options.changeValidate;
                attrs = model.changed;
            } else
                attrs = model.toJSON();

            return this._attrsValidate(attrs, options);
        },
        _attrsValidate: function (attrs, options) {
            var errors = {}; this.remotes = [];

            _.each(attrs, function (valAttr, nameAttr) {
                var e = this._attrValidate(nameAttr, valAttr);
                if (e) {
                    errors[nameAttr] = e;
                    this._eventValidate(nameAttr, e);
                }
            }, this);


            return errors;
        },
        _attrValidate: function (nameAttr, valAttr) {
            var errors = [],
                objRules = this.validation[nameAttr]; // правила для свойства
            objRules && _.each(objRules, function (options, nameRule) { // перебор правил для свойства
                var e = this.rules[nameRule](nameAttr, valAttr, options, this); // вызов метода валидации
                if (e)
                    errors.push(e);
            }, this);
            return errors.length ? errors : undefined;
        },
        _eventValidate: function (nameAttr, errors) {
            if (errors)
                this.trigger('validated validated:invalid', name, false, errors);
            else
                this.trigger('validated validated:valid', name, true);
        },
        _attrChange: function (attrs) {
            var r = {};
            for (var name in attrs)
                if (!_.isEqual(attrs[name], this.get(name)))
                    r[name] = attrs[name];

            return r;
        }
    });


    var m = new lib.ValidModel();
    m.set({ id: 'ui' });
    m.validate();

}(App.Lib);

/*
//#region Настройка отображения ошибок для twitter bootstrap

_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var control = view.$('[' + selector + '=' + attr + ']');
        var group = control.parents(".control-group");
        group.removeClass("error");

        if (control.data("error-style") === "tooltip") {
            // CAUTION: calling tooltip("hide") on an uninitialized tooltip
            // causes bootstraps tooltips to crash somehow...
            if (control.data("tooltip"))
                control.tooltip("hide");
        }
        else if (control.data("error-style") === "inline") {
            group.find(".help-inline.error-message").remove();
        }
        else {
            group.find(".help-block.error-message").remove();
        }
    },
    invalid: function (view, attr, error, selector) {
        var control = view.$('[' + selector + '=' + attr + ']');
        var group = control.parents(".control-group");
        group.addClass("error");

        if (control.data("error-style") === "tooltip") {
            var position = control.data("tooltip-position") || "right";
            control.tooltip({
                placement: position,
                trigger: "manual",
                title: error
            });
            control.tooltip("show");
        }
        else if (control.data("error-style") === "inline") {
            if (group.find(".help-inline").length === 0) {
                group.find(".controls").append("<span class=\"help-inline error-message small-text\"></span>");
            }
            var target = group.find(".help-inline");
            target.text(error);
        }
        else {
            if (group.find(".help-block").length === 0) {
                group.find(".controls").append("<p class=\"help-block error-message small-text\"></p>");
            }
            var target = group.find(".help-block");
            target.text(error);
        }
    }
});

//#endregion
*/

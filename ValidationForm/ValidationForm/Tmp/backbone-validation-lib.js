/// <reference path="../Scripts/underscore.js" />
/// <reference path="../Scripts/backbone.js" />

var _Lib = {};

!function (lib) {

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

    var VBB = Backbone.Validate = Backbone.Model.extend({

        initialize: function (attrs, options) {
            //this.on('change', this.validator, this);
            this.on('change', function () {
            }, this);
            this.on('invalid', function (a,f,d) {
            }, this);
        },
        validate: function (attrs) {
            return this._validator(attrs);
        },
        validator: function (model, options) {
            var attrs = options.validateAll ? model.attributes : model.changed;
            return this._validator(attrs);
        },
        _validator: function (attrs) {
            var errors;
            _.each(attrs, function (valAttr, nameAttr) {
                var vprop = this.validation[nameAttr];
                vprop && _.each(vprop, function (val, key) {
                    errors = addError(errors, nameAttr, this.rules[key](nameAttr, valAttr, vprop[key], this));
                }, this);
            }, this);
            return errors;

        },
        validation: {
            name: {
                'required': true,
                'eq': {
                    value: 'qwert',
                    msg: "только  =  qwert"
                }
            },
            id: {
                'number': true
            }
        },
        rules: {
            required: function (attr, value, options, model) {
                if (options)
                    return !!value ? undefined : getMesError("обязательное поле", options);
                else
                    return;
            },
            eq: function (attr, value, options) {
                return value === options.value ? undefined : getMesError("должно быть равно " + options.value, options);
            },
            number: function (attr, value, options) {
                return _.isNumber(value) ? undefined : "только номер";
            }
        },

    });

    var vbb = new VBB();
    vbb.set({ name: "qwertl", id: 90, ty: 765 }, {validate: true});

}(_Lib);




Backbone.Validation.mixin.validate = function (attr, setOptions) {

    return;
};

//_.wrap(Backbone.Validation.mixin.validate, function (fn, attr, setOptions) {
//    var m = this;
//    return fn(attr, setOptions);
//});


// подключить валидацию
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

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

this.App = this.App || { Lib: {} };
this.App.Lib = this.App.Lib || {};




!function (lib) {

    var base = Backbone.Model.prototype;
    lib.ModelValid = Backbone.Model.extend({
        initialize: function (attr, options) {
            this.validation = _.clone(options.rules);
        },
        validate: function (attr, options) {
            return base.validate.call(this, attr, model);
        },
    });

    lib.ViewValid = Backbone.View.extend({
        digest: new Backbone.Collection(),
        validation: function () {
            Backbone.Validation.bind(this, {
                forceUpdate: true,
            });
            this.model.on('validated', function (isValid, model, errors) {
                if (isValid)
                    this.onValid && this.onValid(model);
                else
                    this.onInvalid && this.onInvalid(model, errors);
            }, this);
        },
        getDigest: function (id, func) {
            var model = this.digest.get(id);
            if (model)
                return func ? func(model) : model.get('obj');
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.stickit();
        }
    });

}(App.Lib);
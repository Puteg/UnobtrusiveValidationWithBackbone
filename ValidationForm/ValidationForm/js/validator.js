/// <reference path="../Scripts/underscore.js" />
/// <reference path="../Scripts/backbone.js" />

!function () {

    //Настройка отображения ошибок для twitter bootstrap
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
        },
    });

    Backbone.Validation.adapters = {
        valRequired: function (data) {
            return {
                required: true,
                msg: data.valRequired
            };
        },
        valNumber: function (data) {
            return {
                pattern: 'number',
                msg: data.valNumber
            };
        },
        valLength: function (data) {
            return {
                rangeLength: [data.valLengthMin, data.valLengthMax],
                msg: data.valLength
            };
        },
        valRange: function (data) {
            return {
                range: [data.valRangeMin, data.valRangeMax],
                msg: data.valRange
            };
        },
        valEmail: function (data) {
            return {
                pattern: 'email',
                msg: data.valEmail
            };
        },
        _create: function (data) {  // создает список правил для одного атрибута http://thedersen.com/projects/backbone-validation/
            var options = [];
            for (var p in data)
                if (this[p])
                    options.push(this[p](data));
            return options.length ? options : undefined;
        },
    };

    Backbone.Validation.bind = _.wrap(Backbone.Validation.bind, function (bind, view, options) {
        if (options.autoValidation) {
            var validation = {}; // список правил для каждого атрибута http://thedersen.com/projects/backbone-validation/
            view.$("[data-val=true]").each(function (item, selector) {
                var data = $(this).data();
                var options = Backbone.Validation.adapters._create(data);
                if (options)
                    validation[data.valAttr || this.name] = options;
            });

            if (view.model && !_.isEmpty(validation))
                view.model.validation = validation;
        }

        return bind(view, options);
    });
}();



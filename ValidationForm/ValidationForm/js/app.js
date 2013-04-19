!function (app, tabName) {

    var Model = Backbone.Model.extend({
        url: "/home/edit/",
        idAttribute: "Id",
        isNew: function () {
            return Backbone.Model.prototype.isNew.call(this) || this.id == 0; 
        }
    });

    var View = Backbone.View.extend({
        events: {
            'submit': 'evSubmit',
            'blur input[type=text]': 'evBlur',
            'change select': 'evChange',
            'change input[type=checkbox]': 'evCheckbox',
        },
        initialize: function () {
            this.model.on('change', this.onChangeValidate, this);
            this.model.on('validated', function (isValid, model, errors) {
                this.$('[type=submit]').toggleClass('disabled', !isValid);
            }, this);
            this.render();
        },
        render: function () {
            Backbone.Validation.bind(this, {
                autoValidation: true,  // при установке формирует model.validation из html attributes  
            });
        },

        onChangeValidate: function (model) {
            model.validate(model.changed);
        },

        evBlur: function (e) {
            var $el = $(e.target);
            this.model.set($el.attr('name'), $el.val());
        },
        evSubmit: function (e) {
            e.preventDefault();

            var data = this.$el.serializeObject();
            this.model.set(data);

            if (this.model.isValid(true)) // true => внутренний вызов this.model.validate();
                this.model.save()
                    .fail(function (d, s) { alert($(d.responseText).filter('title').text() || d.statusText || s); })
                    .done(function () { /* здесь что то сделать. Например: уход на другую станицу */ });
        },
        evChange: function (e) {
            var $el = $(e.target);
            this.model.set($el.attr('name'), $el.val());
        },
        evCheckbox: function (e) {
            var $el = $(e.target);
            this.model.set($el.attr('name'), $el.prop('checked'));
        }
    });

    $(function () {

        var m = new Model();

        var view = new View({
            el: document.getElementById(tabName),
            model: m
        });
    });
}(App, "view");


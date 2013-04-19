/// <reference path="../Scripts/underscore.js" />
/// <reference path="../Scripts/backbone.js" />

!function (app, tabsName, tabName) {

    var lib = app.Lib,
        viewModel = app.Temp[tabsName];

    var View = lib.ViewValid.extend({
        template: _.template($("#template-" + tabName).html()),
        events: {
            //"submit form": "onSubmit",
            "click #nextTab1": "onNext"
        },
        bindings: {
            'input[name=Memo]': {
                observe: 'Memo',
                setOptions: { validate: true },
            },
            'input[name=Name]': {
                observe: 'Name',
                setOptions: { validate: true },
            },
            'select[name=depId]': {
                observe: 'depId',
                selectOptions: {
                    collection: function () { return this.model.selectListItem('depId'); },
                    labelPath: 'text',
                    valuePath: 'value'
                },
                setOptions: { validate: true }
            },
        },
        initialize: function () {
            this.render();
            this.validation();
            this.model.on('validated', function (isValid, model, errors) {
                this.$('#nextTab1').toggleClass('disabled', !isValid);
            }, this);
        },
        onInvalid: function (model, errors) {
            this.$el.trigger('tab:error', this.model, errors);
        },
        onValid: function () {
            this.$el.trigger('tab:success', this.model);
        },
        onNext: function (e) {
            if (this.model.isValid())
                this.$el.trigger('tab:next', this.model);
            else
                this.model.validate()
        }
    });

    $(function () {
        var tabX = new View({ el: document.getElementById(tabName), model: viewModel.dataModel });
    });
}(App, "tabs", "tab1");


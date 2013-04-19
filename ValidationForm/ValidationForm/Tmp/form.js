/// <reference path="../Scripts/underscore.js" />
/// <reference path="../Scripts/backbone.js" />

!function (app, tabName) {

    //var lib = app.Lib,
    //    viewModel = app.Temp[tabsName];

    var adapters = {
        valRequired: function (data) {
            return {
                required: {
                    msg: data.valRequired
                }
            };
        },
        valNumber: function (data) {
            return {
                number: {
                    msg: data.valNumber
                }
            };
        },
        valLength: function (data) {
            return {
                length: {
                    msg: data.valLength,
                    max: data.valLengthMax,
                    min: data.valLengthMin
                }
            };
        },

        createValidation: function (data) {
            var options;
            for (var p in data)
                if (this[p])
                    options = _.extend(options || {}, this[p](data));
            return options;

        }
    };


    var View = Backbone.View.extend({
        events: {
            //"submit form": "onSubmit",
            //"click #nextTab1": "onNext"
        },
        bindings: {
            'input[name="data.Memo"]': {
                observe: 'Memo',
                setOptions: { validate: true },
            },
            'input[name="data.Name"]': {
                observe: 'Name',
            },
            'select[name="data.DepId"]': {
                observe: 'DepId',
                selectOptions: 'auto',
            },
            'select[name="data.StateId"]': {
                observe: 'StateId',
                selectOptions: 'auto',
            },
        },
        initialize: function () {
            this.model.on('change', function (model, o) {
            });
            this.model.validation = this.createValidation();
            this.autoBindingSelect();
            this.render();
            //this.validation();
            //this.model.on('validated', function (isValid, model, errors) {
            //    this.$('#nextTab1').toggleClass('disabled', !isValid);
            //}, this);
        },
        render: function () {
            this.stickit();
        },
        getName: function (el) {

        },
        
        createValidation: function () {
            var validation = {};
            _.each(this.bindings, function (item, selector) {
                var data = this.$(selector).data();
                var options = adapters.createValidation(data);
                if (options) {
                    validation[item.observe] = options;
                }
            }, this);

            return validation;
        },
        autoBindingSelect: function () {
            _.each(this.bindings, function (item, val) {
                if (item.selectOptions === 'auto') {
                    var options = this.$(val).find('option').map(function (i, el) { return { value: el.value, text: el.text }; }).toArray();
                    item.selectOptions = {
                        collection: function () { return options; },
                        labelPath: 'text',
                        valuePath: 'value'
                    };
                }
            }, this);
        }
    });

    $(function () {
        var tabX = new View({ el: document.getElementById(tabName), model: new App.Lib.ValidModel() });
    });
}(App, "tab1");


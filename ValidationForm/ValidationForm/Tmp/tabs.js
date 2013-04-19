/// <reference path="../Scripts/underscore.js" />
/// <reference path="../Scripts/backbone.js" />

!function (app, tabsName) {

    //#region vars
    var lib = app.Lib,  // доступ к библиотекам
        viewModel = app.Temp[tabsName], // viewModel ASP.NET MVC  for tabsName
        dataModel = new lib.ModelValid(viewModel.data, { rules: viewModel.rules }), //  полная модель
        base = lib.TabsView.prototype;  // базовый класс для вкладок
    //#endregion

    //#region Tab - model & view для одной вкладки

    var TabModel = lib.ModelValid.extend({
        //initialize: function (attr, options) {
        //    this.validation = options.rules;
        //}
    });

    var TabView = lib.ViewValid.extend({ // DataPartialView
        events: {
            //"submit form": "onSubmit",
            "click #nextTab1": "onNext",
            "click #nextTab2": "onNext"
        },
        initialize: function (options) {
            this.digest = new Backbone.Collection(options.digest);
            this.render();
            this.validation();
        },

        onInvalid: function (model, errors) {
            this.$el.trigger('tab:error', this.model, errors);
        },
        onValid: function () {
            this.$el.trigger('tab:success', this.model);
        },
        onNext: function (e) {
            this.model.validate();
            if (this.model.isValid())
                this.$el.trigger('tab:next', this.model);
        },

        autoAttr: function (viewModel) {
            for (var p in this.bindings) {
                var name = this.bindings[p].observe || this.bindings[p],
                    value = viewModel.data[name];
                value !== undefined && this.model.set(name, value);
            }
            this.model.setRules(this.model.toJSON());
        }

    });

    //#endregion

    //#region Tabs - View для всех вкладок

    var ViewTabs = lib.TabsView.extend({
        events: function () {
            var e = _.extend({ "save": "onSave" }, base.events);
            return e;
        },
        onTabSuccess: function (e, model) { //  активная вкладка валидна - здесь логика разрешить вкладки 
        },
        onTabNext: function (e, model) {
            base.onTabNext.call(this, e, model);
        },
        onSave: function (e, o) {
            var obj = [];
            this.collection.each(function (item) {
                item.dataView && obj.push(item.dataView.model);
            });
            o.models = obj;
        },
    });

    //#endregion

    $(function () {

        // Создать вкладки 
        //var tabsView = new ViewTabs({ el: document.getElementById(tabsName), collection: new lib.TabsCollections(viewModel.tabsModel) });

        var tabsView = new ViewTabs({ el: document.getElementById("tabs"), collection: new lib.TabsCollections() });

        // связать контекст вкладки tab1 с представлением
        tabsView.attach('tab1', function (tabId) {
            var options = viewModel[tabId];
            var View = TabView.extend({
                template: _.template($("#template-" + tabId).html()),
                bindings: {
                    'input[name=Name]': {
                        observe: 'Name',
                        setOptions: { validate: true },
                    },
                    'select[name=StateId]': {
                        observe: 'StateId',
                        selectOptions: {
                            collection: function () {
                                return this.getDigest('StateId');
                            },
                            labelPath: 'text',
                            valuePath: 'value'
                        },
                        setOptions: { validate: true }
                    },
                    'input[name=Memo]': {
                        observe: 'Memo',
                        setOptions: { validate: true },
                    },
                    'select[name=DepId]': {
                        observe: 'DepId',
                        selectOptions: {
                            collection: function () {
                                return this.getDigest('DepId');
                            },
                            labelPath: 'text',
                            valuePath: 'value'
                        },
                        setOptions: { validate: true }
                    }
                },
                initialize: function (options) {
                    TabView.prototype.initialize.call(this, options);
                    this.model.on('validated', function (isValid, model, errors) {
                        this.$('#nextTab1').toggleClass('disabled', !isValid);
                    }, this);
                },
            });
            return new View({ el: tabsView.$('#' + tabId)[0], digest: options.Digest, model: new TabModel(options.Model, { rules: options.Rules }) });
        });

        // связать контекст вкладки tab2 с представлением
        tabsView.attach('tab2', function (tabId) {

            var options = viewModel[tabId],
                root = viewModel[options.Root].Model;

            new lib.TableView({ el: tabsView.$('div#' + tabId + " table#list")[0], digest: options.Digest, collection: new lib.TableCollection(root.Addr) });

            var View = TabView.extend({
                template: _.template($("#template-" + tabId).html()),
                bindings: {
                    'input[name=Street]': {
                        observe: 'Street',
                        setOptions: { validate: true },
                    },
                    'input[name=City]': {
                        observe: 'City',
                        setOptions: { validate: true },
                    },
                    'select[name=TypeId]': {
                        observe: 'TypeId',
                        selectOptions: {
                            collection: function () {
                                return this.getDigest('TypeId');
                            },
                            labelPath: 'text',
                            valuePath: 'value'
                        },
                        setOptions: { validate: true }
                    }
                },
                initialize: function (options) {
                    TabView.prototype.initialize.call(this, options);
                    this.model.on('validated', function (isValid, model, errors) {
                        this.$('#nextTab2').toggleClass('disabled', !isValid);
                    }, this);
                },
            });
            return new View({ el: tabsView.$('div#' + tabId + " div#edit")[0], digest: options.Digest, model: new TabModel(root.Addr[0], { rules: options.Rules }) });

            return result;
        });

        $('#save').click(function () {
            var o = {};
            tabsView.$el.trigger('save', o);
            _.each(o.models, function (model) { dataModel.set(model.toJSON()); });

            var er = dataModel.validate();
            var v = dataModel.isValid();

            $('#save').css({ color: v ? "#000" : 'red' });
        });

    });

}(App, "ViewModel");


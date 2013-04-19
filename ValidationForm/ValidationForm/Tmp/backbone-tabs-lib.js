/// <reference path="../Scripts/underscore.js" />
/// <reference path="../Scripts/backbone.js" />

this.App = this.App || { Lib: {} };
this.App.Lib = this.App.Lib || {};


!function (lib) {

    var TabModel = Backbone.Model.extend({
        defaults: {
            text: "Tab",
            active: false,
            disabled: false,
            hide: false,
        }
    });

    lib.TabsCollections = Backbone.Collection.extend({
        model: TabModel,
        initialize: function () {
            this.on('change:active', this.onSelected, this);
            this.on('add', function (model) {
                this.onSelected(model, model.get('active'));
            }, this);
        },
        getSelected: function () { return this.selected; },
        getNext: function (id) {
            var model = this.get(id);
            var index = this.indexOf(model);
            var nextModel = this.at(index + 1);
            return nextModel;
        },
        setSelected: function (id) {
            var model = this.get(id);
            model && !model.get('disabled') && model.set({ active: true });
        },
        onSelected: function (model, value) {
            if (value) {
                this.selected && this.selected.set({ active: false });
                this.selected = model;
            }
        }
    });

    lib.TabsView = Backbone.View.extend({
        events: {
            "click .nav-tabs li a": "onElSelected",
            "tab:success": "onTabSuccess",
            "tab:error": "onTabError",
            "tab:element:error": "onTabError",
            "tab:next": "onTabNext"
        },
        initialize: function () {
            var attrs = this.getAttrs();
            this.collection.reset(attrs);
            this.collection.each(function (model) {
                this.onSelected(model, model.get('active'));
            }, this.collection);
            this.collection.on('change:active', this.onSelected, this);
            this.collection.on('change:disabled', function (model, value) {
                this.$("a[href='#" + model.id + "']").parent().toggleClass('disabled', value);
            }, this);
            this.collection.on('change:hide', function (model, value) {
                this.$("a[href='#" + model.id + "']").parent().toggleClass('hide', value);
            }, this);
            this.collection.on('change:text', function (model, value) {
                this.$("a[href='#" + model.id + "']").text(value);
            }, this);
        },
        getAttrs: function () {
            var attrs = [];
            this.$('ul li').each(function (index, item) {
                var $li = $(this);
                attrs.push({
                    active: $li.hasClass('active'),
                    disabled: $li.hasClass('disabled'),
                    hide: $li.hasClass('hide'),
                    id: $li.find('a').attr('href').replace('#', ''),
                    text: $li.find('a').text(),
                });
            });
            return attrs;
        },
        onElSelected: function (e) {
            var id = $(e.target).attr('href').replace('#', '');
            this.collection.setSelected(id);
            return false;
        },

        onSelected: function (model, value) {
            value && this.show(model.id);
        },
        onTabSuccess: function (e, model) { //  активная вкладка валидна - здесь логика разрешить вкладки 
            // ниже реализация сценария: снятие запрета вклади правее текущей
            var id = e.target.id;
            var model = this.collection.getNext(id);
            if (model)
                model.set({ disabled: false });
        },
        onTabError: function (e, model, errors) { // активная вкладка не валидна - здесь логика запрета вкладок 
            // ниже реализация сценария: запрет всех вкладок правее не валидной
            var id = e.target.id, start = false;
            this.collection.each(function (model) {
                if (!start)
                    start = model.id !== id;
                if (start)
                    model.set({ disabled: true });
            });

        },
        onTabNext: function (e, model, tabId) {
            var id = tabId || e.target.id;
            this.nextSelected(id);
        },

        nextSelected: function (id) { // сделать активной вкладку правее tab#id
            var model = this.collection.getNext(id);
            if (model) {
                model.set({ disabled: false })
                this.collection.setSelected(model.id);
            }
        },
        show: function (id) {
            this.$(".active").removeClass('active');
            this.$("a[href='#" + id + "']").parent().addClass("active");
            this.$("div#" + id).addClass("active");
        },

        attach: function (options, func) {
            this.collection.get(_.isString(options) ? options : options.id).dataView = func(options);
        }

    });


}(App.Lib);


!function (lib) {

    var ItemModel = Backbone.Model.extend({
    });

    lib.TableCollection = Backbone.Collection.extend({
        model: ItemModel,
        initialize: function () {
        },
        getSelected: function () { return this.selected; },
        setSelected: function (id) {
            var model = this.get(id);
            model && (this.selected = model);
        },
    });

    lib.TableView = Backbone.View.extend({
        template: _.template("<tr><td><%-TypeId%><td><td><%-City%><td><td><%-Street%><td></tr>"),
        events: {
            "click tr": "evSelected",
        },
        initialize: function (options) {
            this.digest = new Backbone.Collection(options.digest);
            this.render();
        },
        evSelected: function (e) {
            var id = $(e.currentTarget).addClass('small-text').attr('data-id');
            this.collection.setSelected(id);
            return false;
        },

        render: function () {
            this.$el.empty();
            this.collection.each(function (model) {
                var a = model.toJSON();
                var d = this.d2v(a);
                this.$el.append(this.template(d));
            }, this);
        },
        d2v: function (attrs) {
            var r = {};
            for (var p in attrs) {
                var list = this.getDigest(p);
                if (list)
                    r[p] = this.getListText(list, attrs[p]);
                else
                    r[p] = attrs[p];
            }
            return r;
        },
        getDigest: function (id, func) {
            var model = this.digest.get(id);
            if (model)
                return func ? func(model) : model.get('obj');
        },
        getListText: function (list, value) {
            var r = _.find(list, function (d) { return d.value == value; });
            return (r && r.text) || "-";
        },
        show: function (id) {
            this.$(".active").removeClass('active');
            this.$("a[href='#" + id + "']").parent().addClass("active");
            this.$("div#" + id).addClass("active");
        },

    });


}(App.Lib);



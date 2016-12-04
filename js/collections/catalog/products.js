define(function (require) {
    var Model = require('models/product');
    var ErrorView = require('views/document/error');
    return  Backbone.Collection.extend({
        error: false,
        model: Model,
        initialize: function (options) {
            options || (options = {});
            if (options.node)
                this.node = options.node;
            /**
            if (options.view)
                this.view = options.view;
            if (this.view)
                this.on('change', this.view.render, this.view);
            */ 
            if (options.url)
                this.url = options.url;
        },
        fetchPage: function (pager, view) {
            this.on('change', view.onCollectionChange, view);
            if (!this.node) {
                ctx.error = new ErrorView({message: 'Invalid use fetchPage.'});
                return this;
            }
            var ctx = this;
            this.fetch({url:
                        'category/productsPage',
                dataType: 'json',
                data: {pageNo: pager.pageNo, pageSize: pager.pageSize, id: this.node.get('id')},
                success: function (model, resp, options) {
                    ctx.error = false;
                    ctx.trigger('change');
                },
                error: function (model, resp) {
                    ctx.error = new ErrorView({message: 'Fetch ' + ctx.title + ' failed:' + resp.responseText + '.'});
                }
            });
            return this;
        }
    });
});


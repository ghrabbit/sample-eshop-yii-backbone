/**
 * product details view 
**/
define(function (require) {
	var App = require('application');
	var ViewTemplate = require('text!templates/shopping/product/details.mustache');
	var Document = require('views/document/index');
	var ErrorView = require('views/document/error');
	var Model = require('models/product');
	var Mustache = require('mustache');
	return Document.extend({
	title: 'Product Details',
	events:{
		"click .add-to-cart":"addToCart",
	},
    labelsIsReady:function() {
      this.title = App.Labels.product.products;
      this.render();
    },
    modelIsReady:function() {
      this.render();
    },
	initialize: function(options) {
		options || (options = {});
		this.options = options;
        
        App.initLabels('product', App.Labels._product);
        
        if(options.id)
		{
			this.model = new Model;
			this.model.on('change:model',this.modelIsReady,this);
            change_ctx = this;
			this.model.fetch({
				data:{id:options.id},
				success: function(model, resp) /// Variable data contains the data we get from serverside
				{
                    change_ctx.model.trigger('change:model');
				},
				error: function(model,resp)
				{
					change_ctx.error = new ErrorView({ 
						message: [
							"\"Open product details\" is failed! id="+options.id,
							resp.responseText
						]
					});
				},
			});
		};
		
	},
    
	render: function() {
	  if(!(this.model && this.model.attributes.id && App.Labels.product))
      {
        return this;
      }    
	  proxy = this.model.toJSON();
		proxy.hasCategories = proxy.relations.categories.length;
		$(this.el).html(Mustache.render(ViewTemplate, {
			model:proxy, labels:App.Labels.product, 
			errorSummary: this.error? $(this.error.render().el).html():false,
			button:1
		}));
		return this;
	},
	
	addToCart: function() {
		App.cart.add(this.model.get("id"), 1);
	},
});
});

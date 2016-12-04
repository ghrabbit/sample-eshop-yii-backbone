/*
 * cart document
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'models/cart',
	'text!templates/shopping/cart/document.mustache',
	'views/shopping/cart/view',
	'views/document/index'
	],function ($, _, Backbone, App, Cart, ViewTemplate, CartView, Document) {

return	Document.extend({
	error:false,
	config:{template:ViewTemplate},
	
	postInit:function(options) {
		if(!App.cart)	{
			App.cart =  new Cart;
		}
		App.initLabels('cart', App.Labels._cart);
        App.initLabels('product', App.Labels._product);

		this.model = App.cart;
		this.model.on("change", this.refresh, this);
		this.CartView = new CartView({ pageNo:1, pageSize:6 });

	},
	refresh: function() {
		this.CartView.refresh();
		this.render();
    },

	renderInternal: function() {
		if(this.error)
			this.error.play(this,"#home");
		else
		{
			$(this.el).html(this.template({ 
				model:this.model.attributes, 
				labels:App.Labels.cart,
			}));
			this.$('#products-holder').html(this.CartView.render().el);
		}
		
		this.delegateEvents();
		return this;
	},
	setPage: function(pageNo) {
		if(this.CartView) 
		{
			this.CartView.setPage(pageNo);
		}
		return this;
	},	
 	current:function() {
		return this.CartView;	
	},
});
});

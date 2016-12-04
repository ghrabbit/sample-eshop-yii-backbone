/**
 * onspecials item view
**/
define(function (require) {
	var App = require('application');
	var tpl = require('text!templates/shopping/product/onspecials/details.mustache');
	var Mustache = require('mustache');
return Backbone.View.extend({
	title: 'on Special Product',
	events:{
		"click .add-to-cart":"addToCart",
		"click .product-details":"productDetails",
	},
	initialize: function(options) {
		options || (options = {});
		this.template = function(other_options) {
			return Mustache.render(tpl, other_options);
		};
		if(options.model)
			this.model = options.model;
		if(options.labels)
			this.labels = options.labels;	
	},
    
	render: function() {
        $(this.el).html(this.template({model:this.model.proxy(), labels:this.labels, button:1}));
		return this;
	},
	
	addToCart: function() {
		App.cart.add(this.model.get("id"), 1);
	},
	productDetails: function() {
		App.router.navigate("#shopping/productDetails/"+this.model.get("id"), {trigger:true});
	},

});
});

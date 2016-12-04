/**
 * product view as a part of catalog page 
**/
define(function (require) {
	var App = require('application');
	var ViewTemplate = require('text!templates/shopping/product/view.mustache');
	var Mustache = require('mustache');
return Backbone.View.extend({
	title: 'Product',
	events:{
		"click .add-to-cart":"addToCart",
		"click .product-details":"productDetails",
	},
	template: function(options) {
			return Mustache.render(ViewTemplate,options);
	},
	initialize: function(options) {
		options || (options = {});
		if(options.model) this.model = options.model;
		if(options.labels) this.labels = options.labels;
	},
    
	render: function() {
		//console.log('Render product id='+this.model.get('id') + ' name='+this.model.get('name'));
		//console.log('HTML='+this.template(this.model.toJSON(),{fprice:this.model.fprice()}));
		$(this.el).html(this.template({model:this.model.toJSON(), labels:this.labels, routMarker:'#', button:1}));
		//$(this.el).html(this.template({model:this.model}));
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

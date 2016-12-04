/*
 * cart item view is a part of cart document
*/
define(function (require) {
	var App = require('application');	
	var tpl = require('text!templates/shopping/cart/details.mustache');
	var Mustache = require('mustache');
return Backbone.View.extend({
	title: 'Product',
		events:{
		"click .add-to-cart":"addToCart",
		"click .add-to-cart-minus":"addToCartMinus",
		"click .remove-from-cart":"removeFromCart",
		"click .product-details":"productDetails",
	},
	initialize: function(options) {
        options || (options = {});
		this.template = function(other_options) {
			return Mustache.render(tpl, other_options);
		};///_.template(tpl);
		if(options.model)
			this.model = options.model;
		if(options.labels)
			this.labels = options.labels;
	},
    
	render: function() {
        $(this.el).html(this.template({
            qty:this.model.get('qty'), 
            total:this.model.total(), 
            model: this.model.get('product'),
            labels:this.labels, 
            button:1
        }));
        return this;
	},
	afterAdd:function(qty) {
      this.model.set('qty', qty);  
      this.render();
    },
	addToCart: function() {
		App.cart.once('change',this.afterAdd, this);
        App.cart.add(this.model.get("_id"), 1);
	},
	addToCartMinus: function() {
		App.cart.once('change',this.afterAdd, this);
        App.cart.add(this.model.get("_id"), -1);
	},
	afterRemove:function() {
      $(this.el).remove();
      console.log('Remove cart product ='+ JSON.stringify(this.model.toJSON())); 
    },
    removeFromCart: function() {
		App.cart.once('change',this.afterRemove, this);
        App.cart.remove(this.model.get("_id"));
	},
	productDetails: function() {
		App.router.navigate("#shopping/productDetails/"+this.model.get("_id"), {trigger:true});
	},
});
});

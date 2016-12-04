define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'views/document/error',
	'mustache',
	'models/document/dictionary',
	
	'text!templates/components/cartMenu.mustache'
	],function ($, _, Backbone, App, ErrorView, Mustache, Dict, ViewTemplate) {

return Backbone.View.extend({
	model:new Dict({url : 'home/cartMenu'}),
	events: {
		"click #purchase-now":
			function() { /**console.log('purchase-now CLICKED');*/ },
	},
	initialize: function(options) {
		options || (options = {});
		this.model.on('change', this.render, this);
        ctx = this;	
		this.model.fetch({success:function(model,resp){ctx.trigger('change');},});
		///App.cart.on("change", this.render, this);
        ///console.log('App.cart attributes: '+JSON.stringify(App.cart.attributes));
	},
	
	render: function() {
        ///console.log('cart ATTRIBUTES :'+JSON.stringify(App.cart.attributes));
        ///console.log('cart PROXY :'+JSON.stringify(App.cart.proxy()));
        ///console.log('cart JSON :'+JSON.stringify(App.cart.toJSON()));
		$(this.el).html(Mustache.render(ViewTemplate, {model:App.cart.proxy(), labels:this.model.attributes['labels'], urlPrefix:'#'}));
		this.delegateEvents();
		return this;
    },
  
});
});

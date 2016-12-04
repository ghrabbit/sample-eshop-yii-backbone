/**
 * category item view
**/
define(function (require) {
	var App = require('application');
	var ViewTemplate = require('text!templates/shopping/category/view.mustache');
	var Mustache = require('mustache');

return Backbone.View.extend({
	title: 'Category',
	events: {
		"click .subCategories-view": "openSubCategories",	
		"click .catProducts-view": "openProducts",
	},	
	initialize: function(options) {
		options || (options = {});
		this.model = options.model?options.model:undefined;
		this.labels = options.labels?options.labels:undefined;
	},
    
	render: function() {
		proxy = this.model.toJSON();
		
        proxy.hasSubCategories = proxy.relations?proxy.relations.subCategories.length:false;
		proxy.hasProducts = proxy.relations?proxy.relations.products.length:false;
		$(this.el).html(Mustache.render(ViewTemplate, {model:proxy, labels: this.labels, button:true}));
		this.delegateEvents();
		return this;
	},
	
	openSubCategories : function(e) 
	{
	  App.router.navigate("#shopping/category/"+this.model.get("id"), {trigger:true});	
	},
	
	openProducts : function(e) 
	{
       App.router.navigate("#shopping/category/"+this.model.get("id")+'/products', {trigger:true});	
	}

});
});

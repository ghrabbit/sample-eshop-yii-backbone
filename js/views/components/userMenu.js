define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'views/document/error',
	'mustache',
	'models/document/dictionary',
	'text!templates/components/userMenu.mustache'
	],function ($, _, Backbone, App, ErrorView, Mustache, Model, ViewTemplate) {

return Backbone.View.extend({
	model:new Model({url : 'home/userMenu'}),
	initialize: function() {
		this.model.on('change', this.render, this);
        ctx = this;	
		this.model.fetch({success:function(model,resp){ctx.trigger('change');},});
	},
	
	render: function(options) {
		var authenticated = (options && options.authenticated)?options.authenticated:App.user.get('authenticated'); 
	
		$(this.el).html(Mustache.render(ViewTemplate, {
			labels:this.model.attributes['labels'], 
			authenticated:authenticated, 
		}));
		return this;
    },
    
   
});
});

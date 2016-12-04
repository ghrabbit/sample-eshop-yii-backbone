define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'views/document/error',
	///'models/user',
	'mustache',
	'models/document/dictionary',
	'text!templates/components/footer.mustache'
	],function ($, _, Backbone, App, Error, /**User,**/ Mustache, Model, ViewTemplate) {

return Backbone.View.extend({
	model:new Model({url : 'home/footer'}),
	initialize: function() {
      this.model.on('change', this.render, this);
      ctx = this;
      this.model.fetch({success:function(model,resp){ctx.trigger('change');},});
	},

	render: function(options) {
	  $(this.el).html(Mustache.render(ViewTemplate, {
			labels:this.model.attributes['labels'], 
			/**
            authenticated:authenticated, 
			username:username, 
            baseUrl:'',
			routMarker:'/',
            lang: App.lang.toMustache()
            **/
	  }));
      return this;
    },
    
   
});
});

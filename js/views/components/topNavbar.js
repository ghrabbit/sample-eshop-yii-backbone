define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'views/document/error',
	'models/user',
	'mustache',
	'models/document/dictionary',
	'text!templates/components/topNavbar.mustache'
	],function ($, _, Backbone, App, Error, User, Mustache, Model, ViewTemplate) {

return Backbone.View.extend({
    ///template: _.template(ViewTemplate),
	model:new Model({url : 'home/topNavbar'}),
	initialize: function() {
		this.model.on('change', this.render, this);
        ctx = this;
        this.model.fetch({success:function(model,resp){ctx.trigger('change');},});
	},

	render: function(options) {
      var authenticated = (options && options.authenticated)?options.authenticated:App.user.get('authenticated'); 
	  var user = App.user;///new User();
	  var username = (options && options.username)?options.username:user.username(); 
      ///console.log('App.user.authenticated='+App.user.get('authenticated')+' options.authenticated:'+authenticated);
      ///console.log("App.user="+JSON.stringify(App.user.attributes));		
      $(this.el).html(Mustache.render(ViewTemplate, {
			labels:this.model.attributes['labels'], 
			authenticated:authenticated, 
            ///authenticated:App.user.authenticated,
			username:username, 
            baseUrl:'',
			routMarker:'/',
            lang: App.lang.toMustache()
	  }));
	  return this;
    },
    
   
});
});

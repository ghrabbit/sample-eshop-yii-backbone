define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	
	'views/document/notice',
	'views/document/error',
	
	///'models/document/dictionary',
    'models/account/login',
    'models/document/labelsLoader',
	'views/document/index',
    'models/user',
	'text!templates/account/login.mustache',
	'text!templates/account/loginHeader.mustache',
	///'mustache',
	], function ($, _, Backbone, App, Notice, ErrorView, Model, LLoader, Document, User,
      ViewTemplate, HeaderTemplate) {
    var Labels = [['username','Username'],
			['password','Password'],
			['rememberMe','Remember me next time'],
			['submit','Submit'],
			['requiredFields','requiredFields'],
            ['title','Login']]; 
return 	 Document.extend({
	defaults: {
      title: 'Login',
    },
	model:new Model, ///({url:'login/model'}),
	///template: _.template(ViewTemplate),
	config:{template:ViewTemplate/**, fetch:true*/},
	events: {
		"submit form": "submit",
	},
    
    labelsIsReady:function() {
      if(!App.Labels.login)
        return;
      this.title = App.Labels.login.title;
      this.render();
    },
    preInit:function(options) { 
		this.model.idAttribute='username';
		return true;
	},
	postInit:function(options) {
        /**
        if(!App.Labels.login) 
        {
          this.model.once('change:labels', this.labelsIsReady, this); 
          this.model.loadLabels(App.Labels, {error:this.onError, key:'login'});
        }else this.labelsIsReady();
        */
        ///(new LLoader).labels('login', this.labelsIsReady, this, {error:this.onError});
        App.initLabels('login', Labels);
        this.labelsIsReady();
	},
 
    renderInternal: function() {
		///console.log("Current host is "+window.location.host);
		if(!App.Labels.login)
          return this;
        $(this.el).html(this.template(
			{model:this.model.attributes, labels:App.Labels.login, routMarker:'#'},
			{'loginHeader':HeaderTemplate}
		));
		if(this.error)
			this.$('.errorSummary').html(this.error.render().el);
        /// use val to fill in title, for security reasons
        ///this.$('input[name=username]').val(this.model.get('username'));
		///this.$('input[name=rememberMe]').attr('checked',this.model.get('rememberMe'));
		this.delegateEvents();
		return this;
    },
	
	/**
    * Login user
    */
    submit:function (e) {
		e.preventDefault();
		var ctx = this;
		var values = {
				username:this.$('input[name=username]').val(),
				password:this.$('input[name=password]').val(),
				rememberMe:this.$('form input[name=rememberMe]:checked').length,
		};
		///alert("values:"+JSON.stringify(values));
        ///if(this.model.isValid(values)){
        ///if(this.model._validate(values, { validate: true })){
        model = new Model;///({url:'login/model'});
        ///console.log('Model is '+ JSON.stringify(model));
        var error = model.isValid(values)?false:this.validationError;
        
        ///var error = model.doValidate(values, { validate: true })  || null;
        if(error)
        {
          ///console.log('Model is NOT valid: error = '+ JSON.stringify(error));
          this.error = new ErrorView({ message: error.attributes.value });
          return this.render();
        }        
        this.model.save(values,
			{
				success: function(model, resp) {
					///login is ok but maybe not valid
					console.log("SUCCESS!resp="+JSON.stringify(resp));
					ctx.model.set(values);
					ctx.postSubmit(model,resp.valid,resp.message);
				},
				error: function(code,resp) {
					///no login error
					///console.log("ERROR!resp="+JSON.stringify(resp));
					ctx.error = new ErrorView({ message: resp.responseText });
					///just render error
					ctx.render();
				}
			}
        );
	
		
    },


	 /**
     * Checks authorization
     */
        postSubmit:function (model, value, message) {
            if (value) {
				///console.log("postSubmit redirect to index");
				App.user.refresh();
                App.router.navigate('index', {trigger: true});
                
            }
            else {
				///console.log("postSubmit redirect to login");
                ///App.router.navigate('login', {trigger: true});
                
                this.error = new ErrorView({ message: message });
                this.render();
            }

        },

});
});

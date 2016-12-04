define([
	'jquery',
	'underscore',
	'backbone',
	'application',

	'views/document/index',
	'models/document/dictionary',
    'models/document/labelsLoader',
	'mustache',
	'text!templates/account/signup.mustache',
	'text!templates/account/signupHeader.mustache',
	'text!templates/account/signupSuccess.mustache',
	'text!templates/account/captcha.mustache',
	'views/document/notice',
	'views/document/error',
	'models/captcha',
	], function ($, _, Backbone, App, Document, Model, LLoader, Mustache,
	ViewTemplate, HeaderTemplate, SuccessTemplate, CaptchaTemplate, Notice, ErrorView, Captcha) {
        
    var Labels = [
      ['verifyCode','Verification Code'],
	  ['username','Username'],
	  ['firstname','Firstname'],
      ['lastname','Lastname'],
      ['email','Email'],
      ['password','Password'],
      ['phone' ,'Phone'],
      ['address' ,'Address'],
      ['refreshCode' ,'Refresh'],
      ['captchaHelp' ,'captchaHelp'],
      ['submit' ,'Submit'],
      ['requiredFields','requiredFields']    
    ];    
return 	 Document.extend({
	model:new Model({url:'signup/model'}),
	events: {
		"submit form": "submit",
		"click button[name=refreshCaptcha]":function() {
			this.captcha.refresh();
		}
	},
    captcha: new Captcha({url:'signup'}),
	config:{template:ViewTemplate, fetch:true},

    labelsIsReady:function() {
      if(!App.Labels.signup)
        return;
      this.render();
    },
	preInit:function(options) { 
		this.model.idAttribute='username';
		return true;
	},
	
	postInit:function(options) {
		this.captcha.on('change', this.renderCaptcha, this);
        /**
		if(!App.Labels.signup) 
        {
          this.model.once('change:labels', this.labelsIsReady, this); 
          this.model.loadLabels(App.Labels, {error:this.onError, key:'signup'});
        }else this.labelsIsReady();
        */
        ///(new LLoader).labels('signup', this.labelsIsReady, this, {error:this.onError}); 
        App.initLabels('signup', Labels);
        this.labelsIsReady();
	},	
		
	renderCaptcha: function() {
		this.$("#captcha-image").attr('src',this.captcha.get('url'));
	},
	
	renderInternal: function() {
		if(!App.Labels.signup)
          return this;
        $(this.el).html(this.template({ 
				model:this.model.attributes, 
				labels:App.Labels.signup,
				errorSummary:this.error?this.error.render().text:false,
				captcha:this.captcha.attributes,
				routMarker:"#",
			},
			{
				header:HeaderTemplate,
				captcha:CaptchaTemplate,
			}
		));

		this.$('input[name=username]').val('c0rabbit'),
		this.$('input[name=password]').val('abra00w^vv'),
		this.$('input[name=email]').val('amak@examples.com'),
		this.$('input[name=firstName]').val("Anry"),
		this.$('input[name=lastName]').val('Makarevitz'),
		this.$('input[name=phone]').val('+79001122334'),
		this.$('textarea[name=address]').val('Mak-city'),

		this.delegateEvents();
		return this;
    },
	submit:function (e) {

		e.preventDefault();
		var ctx = this;

        this.model.save({
				username:this.$('input[name=username]').val(),
				password:this.$('input[name=password]').val(),
				email:this.$('input[name=email]').val(),
				firstname:this.$('input[name=firstName]').val(),
				lastname:this.$('input[name=lastName]').val(),
				phone:this.$('input[name=phone]').val(),
				address:this.$('textarea[name=address]').val(),
				verifyCode:this.$('input[name=verifyCode]').val(),
			},
			{
				success: function(model, resp) {
					console.log("resp="+JSON.stringify(resp));
					ctx.postSubmit(model, resp.valid, resp.message);

				},
				error: function(code, resp) {
					console.log("code="+code+" resp="+JSON.stringify(resp));
					ctx.error = new ErrorView({ message: resp.ResponseText });
				}
			}
        );
	
		
    },
	
	 postSubmit:function (model, value, message) {
            if (value) {
				///$(this.el).html(_.template(SuccessTemplate)(model.toJSON()));
				$(this.el).html(Mustache.render(SuccessTemplate,model.toJSON()));
            }
            else {
                console.log("msg="+JSON.stringify(message));
                var error = new ErrorView( {'message':message});
				this.$(".errorSummary").html(error.render().el);
            }

    },
});
});

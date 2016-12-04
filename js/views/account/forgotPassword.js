define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	
	'mustache',
	'views/document/index',
	'models/document/dictionary',
    'models/document/labelsLoader',
	'text!templates/account/forgotPassword.mustache',
	'text!templates/account/forgotPasswordSuccess.mustache',
	'text!templates/account/forgotPasswordHeader.mustache',
	'text!templates/account/captcha.mustache',
	'views/document/notice',
	'views/document/error',
	'models/captcha',
	], function ($, _, Backbone, App, Mustache, Document, Model, LLoader, 
	ViewTemplate, SuccessTemplate, HeaderTemplate, CaptchaTemplate, Notice, ErrorView, Captcha) {
        
    var Labels = [
      ['verifyCode','Verification Code'],
	  ['emailOrUsername','emailOrUsername'],
			
	  ['refreshCode' ,'Refresh'],
      ['captchaHelp' ,'captchaHelp'],
      ['submit' ,'Submit'],
      ['requiredFields','requiredFields']
    ];    
return 	 Document.extend({
	model:new Model({url:'forgotPassword/model'}),
	///title:"forgotPassword",
	config:{template:ViewTemplate, fetch:true},
	events: {
		"submit form": "submit",
		"click button[name=refreshCaptcha]":function() {
			this.captcha.refresh();
		}
	},
	captcha: new Captcha({url:'forgotPassword'}),
    labelsIsReady:function() {
      if(!App.Labels.forgotPassword)
        return;
      this.render();
    },
	preInit:function(options) { 
		this.model.idAttribute='email';
		return true;
	},
    postInit:function(options) {
		this.captcha.on('change', this.renderCaptcha, this);
		App.initLabels('forgotPassword', Labels);
        this.labelsIsReady();
	},

	renderCaptcha: function() {
		this.$("#captcha-image").attr('src',this.captcha.get('url'));
	},
	
	renderInternal: function() {
		///console.log("attributes:"+JSON.stringify(this.model.attributes));
		
		$(this.el).html(this.template({ 
				model:this.model.attributes, 
				labels:App.Labels.forgotPassword,
				errorSummary:this.error?$(this.error.render().el).html():false,
				captcha:this.captcha.attributes,
				routMarker:"#",
				///header:this.renderInline(HeaderTemplate)
			},
			{
				header:HeaderTemplate,
				captcha:CaptchaTemplate,
			}
		));

		this.$('input[name=email]').val('yxrabbit@yandex.ru'),

		this.delegateEvents();
		return this;
    },
	submit:function (e) {

		e.preventDefault();
		var ctx = this;

        this.model.save({
				email:this.$('input[name=email]').val(),
				verifyCode:this.$('input[name=verifyCode]').val(),
			},
			{
				success: function(model, resp) {
					///console.log("resp="+JSON.stringify(resp));
					ctx.postSubmit(model, resp.valid, resp.message);

				},
				error: function(code, resp) {
					console.log("code="+code+" resp="+JSON.stringify(resp));
					error = new ErrorView({ message: resp.responseText });
					ctx.$(".errorSummary").html(error.render().el);
				}
			}
        );
	
		
    },
	
	 postSubmit:function (model, value, message) {
            if (value) {
				$(this.el).html(Mustache.render(SuccessTemplate,{model:model.toJSON()}));
            }
            else {
                var error = new ErrorView( {'message':message});
				this.$(".errorSummary").html(error.render().el);
            }

    },
});
});

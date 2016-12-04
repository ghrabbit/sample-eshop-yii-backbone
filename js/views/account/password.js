define([
	'jquery',
	'underscore',
	'backbone',
	'application',

	'views/document/index',
	'models/document/dictionary',
    'models/document/labelsLoader',
	'text!templates/account/password.mustache',
	'text!templates/account/passwordHeader.mustache',
	'text!templates/account/captcha.mustache',
	'views/document/notice',
	'views/document/error',
	'models/captcha',
	], function ($, _, Backbone, App, Document, Model, LLoader, 
	ViewTemplate, HeaderTemplate, CaptchaTemplate, Notice, ErrorView, Captcha) {
    var Labels = [
      ['verifyCode','Verification Code'],
	  ['newPassword','New password'],
	  ['password','Password'],
	  ['confirmPassword','Confirm password'],
	  ['refreshCode' ,'Refresh'],
	  ['captchaHelp' ,'captchaHelp'],
	  ['submit' ,'Submit'],
	  ['requiredFields','requiredFields']
    ];    
return 	 Document.extend({
	model:new Model({url:'password/model'}),
	///title:"Password",
	config:{template:ViewTemplate/**, fetch:true*/},
	events: {
		"submit form": "submit",
		"click button[name=refreshCaptcha]":function() {
			this.captcha.refresh();
		}
	},
	captcha: new Captcha({url:'password'}),
    labelsIsReady:function() {
      if(!App.Labels.password)
        return;
      this.title = App.Labels.password["title"];  
      this.render();
    },
    preInit:function(options) { 
		this.model.idAttribute='currentPassword';
		return true;
	},
    postInit:function(options) {
		this.captcha.on('change', this.renderCaptcha, this);
        App.initLabels('password', Labels);
        this.labelsIsReady();
	},
	renderCaptcha: function() {
		this.$("#captcha-image").attr('src',this.captcha.get('url'));
	},
	renderInternal: function() {
		///console.log("attributes:"+JSON.stringify(this.model.attributes));
		$(this.el).html(this.template({ 
				model:this.model.attributes, 
				labels:App.Labels.password,
				errorSummary:this.error?$(this.error.render().el).html():false,
				captcha:this.captcha.attributes,
				routMarker:"#",
			},
			{
				header:HeaderTemplate,
				captcha:CaptchaTemplate,
			}
		));
		///if(this.error) this.$('.errorSummary').html(this.error.render().el);
		///this.$('input[name=email]').val('amak@examples.com'),

		this.renderCaptcha();

		this.delegateEvents();
		return this;
    },
	submit:function (e) {

		e.preventDefault();
		var ctx = this;
        this.model.save({
				password:this.$('input[name=password]').val(),
				newPassword:this.$('input[name=newPassword]').val(),
                confirmPassword:this.$('input[name=confirmPassword]').val(),
				verifyCode:this.$('input[name=verifyCode]').val(),
			},
			{
				success: function(model, resp) {
					console.log("resp:"+JSON.stringify(resp));
					ctx.afterSubmit(model, resp.valid, resp.message);

				},
				error: function(code, resp) {
					ctx.error = new ErrorView({ message: resp.responseText });
					console.log("resp:"+JSON.stringify(resp));
					ctx.render();
				}
			}
        );
	
		
    },
	
	 afterSubmit:function (model, value, message) {
			 if (value) {
				var notice = new Notice( {'message':message.confirmation});
				///hide notice
				$(notice.el).hide();
				///replace contact form
				$(this.el).html(notice.render().el);
				///slide down and redirect
				notice.play('index');
            }
            else {
                var error = new ErrorView( {'message':message});
				///console.log("ERROR html="+error.el);
				this.$(".errorSummary").html(error.render().el);
            }
    },
});
});

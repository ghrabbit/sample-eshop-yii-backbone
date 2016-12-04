define([
	'jquery',
	'underscore',
	'backbone',
	'application',

	'views/document/index',
	'models/document/dictionary',
    'models/document/labelsLoader',
	'text!templates/account/settings.mustache',
	'text!templates/account/settingsHeader.mustache',
	'text!templates/account/captcha.mustache',
	///'text!templates/account/settingsSuccess.jst',
	'views/document/notice',
	'views/document/error',
	'models/captcha',
	], function ($, _, Backbone, App, Document, Model, LLoader, 
	ViewTemplate, HeaderTemplate, CaptchaTemplate, Notice, ErrorView, Captcha) {
        var Labels = [
          ['verifyCode','Verification Code'],
		  ['username','Username'],
		  ['firstname','Firstname'],
		  ['lastname','Lastname'],
		  ['email','Email'],
		  ['phone' ,'Phone'],
		  ['address' ,'Address'],
		  ['refreshCode' ,'Refresh'],
		  ['captchaHelp' ,'captchaHelp'],
		  ['submit' ,'Submit'],
		  ['requiredFields','requiredFields']
        ];
return 	 Document.extend({
	model:new Model({url : 'settings/model'}),
	config:{template:ViewTemplate, fetch:true},
	events: {
		"submit form": "submit",
		"click button[name=refreshCaptcha]":function() {
			this.captcha.refresh();
		}
	},
	captcha: new Captcha({url:'settings'}),
    labelsIsReady:function() {
      if(!App.Labels.settings)
        return;
      this.render();
    },

    preInit:function(options) { 
		this.model.idAttribute='username';
		return true;
	},
	postInit:function(options) {

		this.captcha.on('change', this.renderCaptcha, this);
		App.initLabels('settings', Labels);
        this.labelsIsReady();
	},
	
	renderCaptcha: function() {
		this.$("#captcha-image").attr('src',this.captcha.get('url'));
	},
	
	renderInternal: function() {
		if(App.user && !App.user.is_logged_in())
		{
			var notice = new Notice( {message:"You must logged in"});
			///hide notice
			$(notice.el).hide();
			///replace contact form
			$(this.el).html(notice.render().el);
			///slide down and redirect
			notice.play('index');
			return this;
		}
		///console.log("model.attributes="+JSON.stringify(this.model.attributes));
		$(this.el).html(this.template(
			{ 
				model:this.model.attributes, 
				labels:App.Labels.settings,
				errorSummary:this.error?$(this.error.render().el).html():false,
				captcha:this.captcha.attributes,
				routMarker:"#",
			},
			{
				header:HeaderTemplate,
				captcha:CaptchaTemplate,
			}
		));
		
		/**
		this.$('input[name=username]').val(this.model.get('username')),
		///this.$('input[name=password]').val(this.model.get('password')),
		this.$('input[name=email]').val(this.model.get('email')),
		this.$('input[name=firstName]').val("Anry"),
		this.$('input[name=lastName]').val('Makarevitz'),
		this.$('input[name=phone]').val('89001122334'),
		this.$('textarea[name=address]').val('Mak-city'),
		*/

		///this.renderCaptcha();

		this.delegateEvents();
		return this;
    },
	submit:function (e) {

		e.preventDefault();
		var ctx = this;
	
        this.model.save({
				username:this.$('input[name=username]').val(),
				///password:this.$('input[name=password]').val(),
				email:this.$('input[name=email]').val(),
				firstname:this.$('input[name=firstName]').val(),
				lastname:this.$('input[name=lastName]').val(),
				phone:this.$('input[name=phone]').val(),
				address:this.$('textarea[name=address]').val(),
				verifyCode:this.$('input[name=verifyCode]').val(),
			},
			{
				success: function(model, resp) {
					console.log("SUCCESS!resp="+JSON.stringify(resp));
					///console.log("SUCCESS!id="+ctx.id);
					ctx.afterSubmit(model, resp.valid, resp.message);

				},
				error: function(code, resp) {
					console.log("code="+code+" resp="+JSON.stringify(resp));
					error = new ErrorView({ message: resp.responseText });
					$(ctx.el).html(error.render().el);

				}
			}
        );
	
		
    },
	
	 afterSubmit:function (model, value, message) {
            if (value) {
				var notice = new Notice( {'message':message.confirmation});
				//hide notice
				$(notice.el).hide();
				//replace main form
				$(this.el).html(notice.render().el);
				//slide down and redirect
				notice.play('index');
            }
            else {
                var error = new ErrorView( {'message':message});
				this.$(".errorSummary").html(error.render().el);
            }

    },
});
});

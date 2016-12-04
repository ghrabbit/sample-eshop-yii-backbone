define([
	'jquery',
	'underscore',
	'backbone',
	'application',

	'views/document/index',
	'models/document/dictionary',
    'models/document/labelsLoader',
	'text!templates/home/pages/contact.mustache',
	'text!templates/account/captcha.mustache',
	'views/document/notice',
	'views/document/error',
	'models/captcha',
	'mustache',
	///'bootstrap'
	], function ($, _, Backbone, App, Document, Model, LLoader,
	ViewTemplate, CaptchaTemplate, Notice, ErrorView, Captcha, Mustache /**Bootstrap*/) {
    var Labels = [
      ['verifyCode','Verification Code'],
	  ['name','Family Name'],
	  ['email','Email'],
	  ['subject','Subject'],
	  ['body','Body'],
	  ['title','Contact'],
	  ['refreshCode','Refresh'],
	  ['captchaHelp','captchaHelp'],
	  ['submit','Submit'],
	  ['requiredFields','requiredFields'],
	  ['filloutForm','filloutContactForm'],
    ];
return 	 Document.extend({
	events: {
		"submit form": "contact",
		"click button[name=refreshCaptcha]":function() {
			this.captcha.refresh();
		}
	},
	captcha: new Captcha({url:'contact'}),
	config:{template:ViewTemplate, fetch:true},
    /**/
    labelsIsReady:function() {
      if(!App.Labels.contact)
        return;
      this.title = App.Labels.contact.title;
      this.render();
    },
    preInit:function() {
      this.model = new Model();
	  this.model.url = 'contact/model';
	  this.model.idAttribute='username'; 
      return true; 
    },
    postInit:function() {
	  ///(new LLoader).labels('contact', this.labelsIsReady, this, {error:this.onError});
      this.captcha.on('change', this.renderCaptcha, this); 
      App.initLabels('contact', Labels);
      this.labelsIsReady();
    },
    
	renderCaptcha: function() {
		this.$("#captcha-image").attr('src',this.captcha.get('url'));
	},
	renderInternal: function() {
		if(!App.Labels.contact)
          return this;
        
        $(this.el).html(this.template(
			{
				model:this.model.attributes, 
				labels:App.Labels.contact,
				captcha:this.captcha.attributes,
				routMarker:"#",
			},
			{
				captcha:CaptchaTemplate,
			}
				
		));
		
        if(this.error)
			this.$('.errorSummary').html(this.error.render().el);
		///init for test only comment or remove for product
		this.$('input[name=name]').val('c0rabbit');
		this.$('input[name=email]').val('amak@examples.com');
		this.$('input[name=subject]').val('test');
		this.$('textarea[name=body]').val('HELLO, world!');

		///enable tooltip
		///this.$('button[name=refreshCaptcha]').tooltip();


		this.delegateEvents();
		return this;
    },
	contact:function (e) {
		e.preventDefault();
		var ctx = this;
        this.model.save({
				name:this.$('input[name=name]').val(),
				email:this.$('input[name=email]').val(),
				subject:this.$('input[name=subject]').val(),
				body:this.$('textarea[name=body]').val(),
				verifyCode:this.$('input[name=verifyCode]').val(),
			},
			{
				success: function(model, resp) {
					ctx.checkContact(model,resp.valid, resp.message);

				},
				error: function(code, resp) {
					ctx.error = new ErrorView({ message: resp.responseText });
					ctx.render();
				}
			}
        );
	
		
    },
	
	 checkContact:function (model, value, message) {
            if (value) {
				var notice = new Notice( {'message':message.confirmation});
				///hide notice
				$(notice.el).hide();
				///replace contact form
				$(this.el).html(notice.render().el);
				///slide down and redirect
				notice.play('index');
				///App.router.navigate('index', {trigger: true});
            }
            else {
                var error = new ErrorView( {'message':message});
				console.log("ERROR html="+error.el);
				this.$(".errorSummary").html(error.render().el);
				///App.router.navigate('contact', {trigger: true});
            }

    },
});
});

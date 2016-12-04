/**
 * purchase document
**/
define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	
	'views/document/notice',
	'views/document/error',
	
	'models/checkout',
	'views/document/index',
    'text!templates/shopping/purchase/document.mustache',
	'text!templates/shopping/purchase/emptyCart.mustache',
	'text!templates/shopping/purchase/header.mustache',
	'text!templates/shopping/purchase/wizzard/userData.mustache',
	'collections/catalog/products',
	], function ($, _, Backbone, App, Notice, ErrorView, Model, Document, 
	ViewTemplate, EmptyCartTemplate, HeaderTemplate, UserDataTemplate, ProductCollection)
{

return 	 Document.extend({
	model:App.checkout || (App.checkout = new Model()),
	config:{template:ViewTemplate, fetch:true/**, urlParams:'labels=1'*/},
	current_step:Number(1),
	events: {
		"submit form": "submit",
		"click  .wizzard-prev": "prev",
		"click  .wizzard-next": "next",
		"click  .wizzard-finish": "finish",
	},
	postInit:function()
	{
		App.Labels.checkout || (App.Labels.checkout = this.model.labels(this, {error:this.onError}));
	},
 
    renderInternal: function() {
		if(!App.cart.size()) {

			$(this.el).html(this.template({labels:App.Labels.checkout, hashMarker:'#'}, 
			{emptyCart:EmptyCartTemplate, header:HeaderTemplate}));
		}else{
			///NotImplemented
            $(this.el).html(this.template({labels:App.Labels.checkout}));
            
            this.error = new Notice({ prompt:'Attention', message: '<strong>Not</strong> implemented yet' });
            /**
            $(this.el).html(this.template(
				{
					model:this.model.attributes, 
					labels:App.Labels.checkout, 
					cart:App.cart.proxy(),
					items:App.cart.collection.models,
					date:(new Date()).toLocaleString()
				},
				{
					header:HeaderTemplate, 
					wizzard:UserDataTemplate
				}
			));
			if(this.current_step == 1) {
				this.$('.wizzard-step1').removeClass('hidden');
				this.$('.wizzard-next').removeClass('hidden');
			}else if(this.current_step == 2) {
				this.$('.wizzard-step2').removeClass('hidden');
				this.$('.wizzard-prev').removeClass('hidden');
				this.$('.wizzard-next').removeClass('hidden');
			}else if(this.current_step == 3) {
				this.$('.wizzard-step3').removeClass('hidden');
				this.$('.wizzard-prev').removeClass('hidden');
				this.$('.wizzard-next').removeClass('hidden');
			}else if(this.current_step == 4) {
				this.$('.wizzard-step4').removeClass('hidden');
				this.$('.wizzard-prev').removeClass('hidden');
				this.$('.wizzard-finish').removeClass('hidden');
			}		
			*/
			if(this.error)
				this.$('.errorSummary').html(this.error.render().el);
		}
		this.delegateEvents();
		return this;
    },
	
	/**
    * submit form data
    */
    submit:function (e) {
		e.preventDefault();
		var ctx = this;
		/**
		var values = {
				customer:this.$('input[name=customer]').val(),
				contact:this.$('input[name=contact]').val(),
				address:this.$('textarea[name=address]').val(),
		};
		///console.log("values:"+JSON.stringify(values));
		*/


        this.model.save({},
			{
				success: function(model, resp) {
					ctx.postSubmit(model,resp.valid,resp.message);
				},
				error: function(code,resp) {
					ctx.error = new ErrorView({ message: resp.responseText });
					///just render error
					ctx.render();
				}
			}
        );
		
    },


	 /**
     * post submit success action 
     */
    postSubmit:function (model, value, message) {
            if (value) {
			  App.router.navigate('index', {trigger: true});
            }
            else {
              this.error = new ErrorView({ message: message });
              this.render();
            }

    },
    
    
    hide_current:function() {
		if(this.current_step == 1) {
			this.$('.wizzard-step1').addClass('hidden');
			this.$('.wizzard-next').addClass('hidden');
				
			var values = {
				customer:this.$('input[name=customer]').val(),
				contact:this.$('input[name=contact]').val(),
				address:this.$('textarea[name=address]').val(),
			};
			this.model.set(values);
		}else if(this.current_step == 2) {
				this.$('.wizzard-step2').addClass('hidden');
				this.$('.wizzard-prev').addClass('hidden');
				this.$('.wizzard-next').addClass('hidden');
		}else if(this.current_step == 3) {
				this.$('.wizzard-step3').addClass('hidden');
				this.$('.wizzard-prev').addClass('hidden');
				this.$('.wizzard-next').addClass('hidden');
		}else if(this.current_step == 4) {
				this.$('.wizzard-step4').addClass('hidden');
				this.$('.wizzard-prev').addClass('hidden');
				this.$('.wizzard-finish').addClass('hidden');
		}	
	},
	
	next:function() {
		this.hide_current();
		this.current_step++;
		this.render();
	},
	
	prev:function() {
		this.hide_current();
		this.current_step--;
		this.render();
	},
	
	finish:function(e) {
		/**
		this.hide_current();
		this.current_step++;
		this.render();
		*/
		this.submit(e);
	},
});
});

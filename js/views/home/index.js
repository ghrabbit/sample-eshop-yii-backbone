//Home index
define([
	'jquery',
	'underscore',
	'backbone',
	///'collections/onSpecials',
	'text!templates/home/index.mustache',
	'views/shopping/product/onspecials/index',
	'views/document/index'
	],function ($, _, Backbone, ViewTemplate,/**OnSpecials,*/ OnSpecialsView, Document) {

return	Document.extend({
	error:false,
	title:"Eshop (frontend)",
	config:{template:ViewTemplate},
	///template: _.template(ViewTemplate),
	onSpecials: new OnSpecialsView({ pageNo:1, pageSize:6 }),
	current:function() {
		return this.onSpecials;	
	},
	renderInternal: function() {
		$(this.el).html(this.template({ 
			errorSummary:this.error?this.error.render().html():false
		}));
		///insert onSpecials.render().el
		this.$('#onspecials-holder').html(this.onSpecials.render().el);
		this.delegateEvents();
		return this;
	},
	setPage: function(pageNo) {
		if(this.onSpecials) 
		{
			this.onSpecials.setPage(pageNo);
		}
		return this;
	},	
 	
});
});

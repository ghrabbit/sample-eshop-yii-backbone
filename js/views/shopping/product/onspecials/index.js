/**
 * onspecials index view
**/

define(function (require) {
	var App = require('application');
	var OnSpecials = require('collections/onSpecials');
	var ProductView = require('views/shopping/product/onspecials/details');
	var ViewTemplate = require('text!templates/shopping/product/onspecials/index.mustache');
	var Pager = require('views/components/pager');
	var Dictionary = require('models/document/dictionary');
	var ErrorView = require('views/document/error');
return Backbone.View.extend({
	title: 'On specials',
	initialize: function(options) {
		options || (options = {});
		
		this.collection = new OnSpecials({view:this});
        this.collection.on('change', this.render, this);
		App.Labels.product || (App.Labels.product = (new this.collection.model).labels(this, {error:this.onError}));

		if(this.error)
			return;
		
		this.pager = new Pager({
			pageNo:  options.pageNo, 
			pageSize:  options.pageSize,
			page:this,
			url: 'shopping/onSpecialsTotalCount', 
		});
		if(this.pager.error)
			this.error = this.pager.error;
		else
			this.error = this.collection.fetchPage(this.pager).error;
	},
    
	render: function() {
		$(this.el).html(ViewTemplate);
		
		if(this.error)
			this.$("#notice").html(this.error.el);
		
		else if(this.collection.models.length > 0) 
		{
			this.collection.each(this.addOne, this);
            this.$('.pager-holder').html(this.pager.render().el);
		} 

		this.delegateEvents();
		return this;
	},
	
	addOne: function(product) {
		var view = new ProductView({model: product, labels:App.Labels.product});
		this.$("#on-specials").append(view.render().el);
	},
	
	setPage: function(pageNo) {
		this.pager.setPage(pageNo);
	},	
	urlTemplate:"shopping/onspecials",
	pageChanged: function() 
	{
		if(this.error = this.collection.fetchPage(this.pager).error)
		  this.render();
		Backbone.history.navigate(this.urlTemplate+"/pn"+this.pager.pageNo);
		
	},
	url:function(){
		return this.urlTemplate+this.pager.pageNo?('/pn'+this.pager.pageNo):'';},	
	
});
});

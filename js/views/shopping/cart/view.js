/*
 * cart page is a part of cart document
*/

define(function (require) {
	var App = require('application');
	var DetailsView = require('views/shopping/cart/details');
	var ViewTemplate = require('text!templates/shopping/cart/index.mustache');
	var Pager = require('views/components/pager');
	var Dictionary = require('models/document/dictionary');
	var ErrorView = require('views/document/error');
	var Model = require('models/product');
    
var CartItem = Backbone.Model.extend({
    idAttribute: '_id',
    total:function() {
      return this.attributes['qty']*this.attributes['product'].price;  
    },
});	

var CartPage = Backbone.Collection.extend({
	error:false,	
    model: CartItem,
	initialize:function(options)
	{
		options || (options = {});
        this.node  = options.node?options.node:new this.model;
		this.view = options.view;
        this.on('change', this.view.render, this.view);
	},		
	
	fetchPage:function(pager, view)
	{
		if(view) this.on('change:collection', view.collectionRender, view);
		var ctx = this;
		
		this.fetch({
			url: 'shopping/cartPage',
			///dataType: 'json',
			data: {pageNo:pager.pageNo, pageSize:pager.pageSize, id:this.node.get('id')},
			success: function(collection, resp, options) {
				///ctx.error = false;
				if(!collection.length) {
                    ctx.error =	new ErrorView({notice:1, message: 'No cart products was found! Cart is Empty', prompt:'Attention' });
                }
                ctx.trigger('change:collection');
			},
			
			error: function(model,resp) {
                ctx.error =	new ErrorView({ message: 'Fetch '+ctx.title+' failed:'+resp.responseText+'.' });
                ctx.trigger('change:collection');
			}
		});
		return this;
	}	
});
	
return Backbone.View.extend({
	title: 'Cart Items Page',
	labelsIsReady:function() {
      if(!(App.Labels.product && App.Labels.cart))
        return;
      this.labels = _.extend(App.Labels.product, App.Labels.cart);  
      this.title = this.labels.title;
      this.render();
    },
    
    collectionRender:function() {
      if(this.collection.error) {
        this.error = this.collection.error;
      }  
      this.collectionIsReady = true;
      this.render();
    },
    initialize: function(options) {
		options || (options = {});
		this.options = options;

		this.pager = new Pager({
			pageNo:     options.pageNo, 
			pageSize:   options.pageSize,
			totalCount: App.cart.size(),
			page:       this,
		});
		
        if(this.pager.error) {
			this.error = this.pager.error;
            return;
		}
		this.collection = new CartPage({view:this});
        this.collection.fetchPage(this.pager, this);
		
        this.labelsIsReady();		
	},
    /**
    refresh: function() {
		///this.collection = new CartPage({view:this});
		///this.error = this.collection.fetchPage(this.pager, this).error;
 	},
    */	
	render: function() {
	  if(!(this.labels && this.pager && this.collectionIsReady))
      {	
        return this;
      }  
      
      $('.top-title').html(this.title); 
      if(this.error)
	  {
			$(this.error.el).hide();
			$(this.el).html(this.error.render().el);
			this.error.play('index');
	  }
	  else
	  {
            $(this.el).html(ViewTemplate);
            
            if(this.collection.models.length > 0) 
			{
                this.collection.each(this.addOne, this);
				this.$('.pager-holder').html(this.pager.render().el);
			} 
	  }

	  this.delegateEvents();
	  return this;
	},
	
	addOne: function(item) {
		var view = new DetailsView({ model:item, labels:this.labels, parent:this});
        this.$(".panel-body").append(view.render().el);
	},
	
	setPage: function(pageNo) {
		this.pager.setPage(pageNo);
	},	
	urlTemplate:"shopping/cart",
	url:function(){
		return this.urlTemplate+(this.pager.pageNo?('/pn'+this.pager.pageNo):'');},
	pageChanged: function() 
	{
		this.error = this.collection.fetchPage(this.pager).error;
		this.render();
		Backbone.history.navigate(this.urlTemplate+"/pn"+this.pager.pageNo);
		
	}	
	
});
});

/**
 * product collection view as a part of catalog page
**/
define(function (require) {
	var App = require('application');
	var SelfTemplate = require('text!templates/shopping/product/index.mustache');
	var Pager = require('views/components/pager');
	var Collection = require('collections/catalog/products');
	var Category = require('models/category');
	var ModelView = require('views/shopping/product/view');
	var Dictionary = require('models/document/dictionary');
	var ErrorView = require('views/document/error');
	var CatalogIndex = require('views/shopping/index');
    var Product = require('models/product');
    var Mustache = require('mustache');
return CatalogIndex.extend({
	///title: App.Labels.product['products'],
	label:function(){return this.model.get('title');},
	getId:function(){	return this.model.get('id');	},
	prev_id:function(){	
			return Number(this.model.get('prev_id'));
	},
	template: _.template(SelfTemplate),
	
	initModel:function(options)
	{
		id = options.id?options.id:0;
		if(id)
		{
			ctx = this;
            this.model.fetch({
                data:{id:id},
                success:function(data,resp){
				  ctx.init()
			    },
            });
		}
	},
	initialize: function(options) {
		options || (options = {});
        this.options = options;
        
        App.initLabels('product', App.Labels._product);
        this.title = App.Labels.product.products;
        
        if(options.model)
        {
          this.model = options.model;
          this.init(options);
        }else 
        {
          this.model = new Category();
          this.model.once('change:model',this.modelIsReady,this);
          if(options.id) {
            this.model.set('id',options.id);  
            ctx = this;
            this.model.fetch({
                data:{id:options.id},
                success:function(data,resp){
                  ctx.model.trigger('change:model');
			    },
            });
          }else this.init(options);
        }     
    },   
    labelsIsReady:function() {
      this.title = App.Labels.product.products;
      this.render();
    },
    modelIsReady:function() {
      this.init();
      this.render();
    },
    
    onCollectionChange:function() {
      this.render();
    },
     	
	init: function(options) {	
		this.pager = new Pager({
			page:this,
			totalCount:this.model.get('relations').productsCount,
			pageNo:this.options.pageNo
		});
		if(!this.pager.error)
		{
            this.collection = new Collection({node:this.model});
			this.urlTemplate='#shopping/category/'+this.collection.node.get("id")+"/products";
			this.collection.fetchPage(this.pager, this);
		}
	},
    url:function(){
      pageNo = this.pager?this.pager.pageNo:this.options.pageNo;
      ret = this.urlTemplate+(pageNo?("/pn"+pageNo):"");
      return ret;
    },

	render: function() {
      ///check  conditions for render
      if(!(this.pager && this.collection && App.Labels.product))
      {
        return this;
      }
      ///tell everyone ready to render
      this.trigger('readyToRender');  
        
      if(this.options.parent) {
        this.options.parent.$('#view-title').html(this.title);  
      }   
		
      $(this.el).html(Mustache.render(SelfTemplate, {model:this.model.toJSON(), labels:App.Labels.category/**this.labels*/}));
		
		if(this.error)
			this.$(".notice").html(this.error.el);
		
		if(this.pager.error)
			this.$(".notice").append(this.page.error.el);
		
		if(this.collection.error)
			this.$(".notice").append(this.collection.error.el);
		
		if(this.collection.models.length > 0) 
		{
			this.collection.each(this.addOne, this);
			this.$('.pager-holder').html(this.pager.render().el);
		} 
		else 
			this.$(".notice").toggleClass("alert alert-warning")
				.append("<h3>No catalog items found!</h3>");
		
		this.delegateEvents();
		return this;
	},
	
	addOne: function(model) {
		var view = new ModelView({model: model, labels:App.Labels.product/**this.labels*/});
		this.$(".content").append(view.render().el);
	},
	
	pageChanged: function() 
	{
		this.error = this.collection.fetchPage(this.pager).error;
		this.render();
		Backbone.history.navigate(this.urlTemplate+"/pn"+this.pager.pageNo);
	}	
	

});
});

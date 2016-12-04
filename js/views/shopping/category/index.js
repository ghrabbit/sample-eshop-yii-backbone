/**
 * category index view
**/
define(function (require) {
	var App = require('application');
	var ViewTemplate = require('text!templates/shopping/category/index.mustache');
	var Pager = require('views/components/pager');
	var Categories = require('collections/catalog/categories');
	var Category = require('models/category');
	var ModelView = require('views/shopping/category/view');
	var Dictionary = require('models/document/dictionary');
	var ErrorView = require('views/document/error');
	var Mustache = require('mustache');
	var CatalogIndex = require('views/shopping/index');
return CatalogIndex.extend({
	///title: 'Category/Index',
	label:function(){return this.model.get('title');},
    getId:function(){	return this.model.get('id');	},
	prev_id:function(){	
		return Number(this.model.get('prev_id'));
	},
    safeInit:function() {
      ///call init after fetch
      this.init();
    },
	initModel:function(options)
	{
		
		that = this;
		oid = options.id?options.id:0;
        this.model.set('id',oid);
        this.model.on('change', this.safeInit, this);
        this.model.fetch({
				data:{id:oid},
                success:function(model,resp){
                  that.trigger('change');
				},
				error:function(code,resp){
					that.error = new ErrorView({message:resp.responseText});
				}
		});
	},
    
    
	url:function(){
      pageNo = this.pager?this.pager.pageNo:this.options.pageNo;
        
      return  this.urlTemplate+(pageNo?("/pn"+pageNo):"");
    },
    
    initialize: function(options) {
		options || (options = {});
		this.options = options;
		if(options.model)
          this.model = options.model;
        else this.model = new Category(); 
        
        App.initLabels('category', App.Labels._category);
                          
        if(options.model)
        {
          this.init();
        }else
          this.initModel(options);	
        this.title = App.Labels.category.subCategories;
        this.render();  
	},
    init:function() {
          this.collection = new Categories({view:this, node:this.model});
        
		  this.pager = new Pager({
			page:this,
			url: 'category/subCategoriesTotalCount', /// JQuery loads serverside.php :)
			data:{id:this.collection.node.get('id')},
			pageNo:this.options.pageNo
		  });
		
          if(!this.pager.error)
		  {
			this.urlTemplate='#shopping/category/'+this.collection.node.get("id");
			this.error = this.collection.fetchPage(this.pager, this).error;
		  }
    }, 
    
    onCollectionChange:function() {
      this.render();
    },     
    
	render: function() {
	  ///validate
      if(!(this.pager && this.collection && App.Labels.category))
        return this;
      
      this.trigger('readyToRender');
      
       if(this.options.parent) {
        this.options.parent.$('#view-title').html(this.title);  
      }   

		$(this.el).html(Mustache.render(ViewTemplate, {model:this.model.toJSON(),labels:App.Labels.category/**this.labels*/}));
		
		if(this.error)
			this.$(".notice").html(this.error.el);
		
		if(this.pager && this.pager.error)
			this.$(".notice").append(this.page.error.el);
		
		if(this.collection && this.collection.error)
			this.$(".notice").append(this.collection.error.el);
		
		if(this.collection && this.collection.models.length > 0) 
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
		var view = new ModelView({model: model, labels:App.Labels.category/**this.labels*/});
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

define(function (require) {
	var App = require('application');
	var Categories = require('collections/catalog/categories');
	///var Pager = require('views/components/pager');
	var ViewTemplate = require('text!templates/shopping/catalog.mustache');
	var Document = require('views/document/index');
	var Breadcrumbs = require('views/components/breadcrumbs');
	var ErrorView = require('views/document/error');
	var CategoryIndex = require('views/shopping/category/index');
	var Mustache = require('mustache');
	var Dictionary = require('models/document/dictionary');
    
    var Labels = [
      ['catalog','Catalog'],
	  ['title','Catalog'],
    ];
    
return Document.extend({
	title: undefined,
	model: new Dictionary({url : 'catalog/model'}),
	events: {
		"click #test-button": function() { alert("TEST is fine!"); },	
	},
    /**
    labelsIsReady:function() {
      this.render();
    },
    */
	initialize: function() {
      App.initLabels('catalog', Labels);
      this.breadcrumbs = new Breadcrumbs();
	  this.push(new CategoryIndex({id:0, parent:this}));
      ///this.labelsIsReady();
      this.render();
	},
	render: function() {

		$(this.el).html(Mustache.render(ViewTemplate, {labels:App.Labels.catalog/**this.model.toJSON()*/, title:this.title}));
        this.$('#breadcrumbs-holder').html(this.breadcrumbs.render().el);
		
		view = this.breadcrumbs.last();
		if(view) 
        {
            this.$('#view-holder').html(view.render().el);
        }    

		this.delegateEvents();
		return this;
	},
	
	current:function() {
		return this.breadcrumbs.last();	
	},
	
	///push view to breadcrumbs and render it
	///view is CategoryIndex / subCategories view
	push:function(view, options)
	{
		options || (options = {});
		view.on('activate', this.activate, this);
        this.breadcrumbs.push(view);
		this.title = view.title;
		if(options.render) this.render();
		if(options.history) Backbone.history.navigate(view.url());
		return this;
	},

	activate:function(event, options)
	{
		id = event.getId();
		///find and cut tail part
        options || (options = {});
		found = this.breadcrumbs.find(id);
		if(found) this.breadcrumbs.cut(id, (id==0)?undefined:0);
		if(!found) 
		{
			prev_id = event.prev_id();
			if(!((prev_id == null) || (prev_id == 0))) {
				///make header part
				index = this;
                collection = new Categories();
				collection.fetch({
                    data:{id:id}, 
                    url:"shopping/categoryparents",
                    /**
                    success:function(data){
                      console.log('LOADING BREADCRUMPS ITEMS for id='+id);
                      collection.forEach(function(model){
					    console.log('LOADING BREADCRUMPS ITEMS model:id='+model.get('id'));
                        index.push(new CategoryIndex({model:model, parent:index}));
				    }); 
                    },*/
                });
				
                collection.forEach(function(model){
					this.push(new CategoryIndex({model:model, parent:this}));
				});
                
			}
		}
		///and push
		return this.push(event, options);
	},

});
});

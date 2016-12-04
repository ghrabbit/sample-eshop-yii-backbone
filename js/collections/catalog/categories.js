define(function (require) {
	var Model = require('models/category');
	var ErrorView = require('views/document/error');
	return  Backbone.Collection.extend({
	title: 'Subcategories of ',	
	error:false,	
    model: Model,
	url: function() { return 'category/subCategories/'+this.node.get('id');},
	view:null,	
	initialize:function(options)
	{
		options || (options = {});
		this.node  = options.node?options.node:new Model();
		this.title += this.node.get('title');
		///this.view = options.view;
        
	},		
	fetchPage:function(pager, view)
	{
        if(view) this.on('change', view.onCollectionChange, view);
		var thisB = this;
		this.fetch({
			url: 'category/subCategoriesPage',
			dataType: 'json',
			data: {pageNo:pager.pageNo, pageSize:pager.pageSize, id:this.node.get('id')},
			
			success: function(model, resp, options) {
                thisB.error = false;
                thisB.trigger('change');
			},
			
			error: function(code,resp) {
				thisB.error =	new ErrorView({ message: 'Fetch '+thisB.title+' failed:'+resp.responseText+'.' });
			}
		});
		return this;
	}	
});
});

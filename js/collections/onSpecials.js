define(function (require) {
	var Product = require('models/product');
	var ErrorView = require('views/document/error');
	return  Backbone.Collection.extend({
	error:false,	
    model: Product,
	url: 'shopping/onSpecials',
	view:null,

	fetchPage:function(view)
	{
		var ctx = this;
		this.fetch({
			url: 'shopping/onSpecialsPage',
			dataType: 'json',
			data: {pageNo:view.pageNo, pageSize:view.pageSize},
			success: function() {
				ctx.error = false;
                ///fire trigger to render view
                ctx.trigger('change');
			},
			
			error: function(model, resp) {
				ctx.error = new ErrorView({ message: "Error loading on specials products."+ resp.responseText});
			}
		});
		return this;
	}	
});
});

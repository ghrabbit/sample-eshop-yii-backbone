define(function (require) {
	var TextPare = require('models/textPare');
	var ErrorView = require('views/document/error');
return  Backbone.Collection.extend({
	error:false,	
    model: TextPare,
	url: 'home/messages',
	view:null,
    initialize:function(options) {
        this.fetchAll(options);
    },
	fetchAll:function(options)
	{
		options || (options = {data:{}});
        var ctx = this;
		this.fetch({
			///url: 'shopping/onSpecialsPage',
            ///async:false,
			///dataType: 'json',
            data:options.data,
			success: function(collection, resp) {
				ctx.error = false;
                ///console.log('LOADED MESSAGES:'+JSON.stringify(collection));
                ///fire trigger to render view
                ctx.trigger('change');
			},
			
			error: function(model, resp) {
				ctx.error = new ErrorView({ message: "Error loading on translate messages."+ resp.responseText});
			}
		});
		return this;
	}	
});
});

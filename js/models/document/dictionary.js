define(function (require) {
	var Backbone = require('backbone');
	
return 	Backbone.Model.extend({
	defaults:{
	  type:  'dictionary',
      title: 'eShop Document',
      _labels:false,
	},
	initialize: function(options) {
		options || (options = {});
		if(options.url) this.url = options.url;
	},
	labels:function(ctx, options)
	{
		var ret = false;
		$.ajax(_.extend({
			url:this.url+'?action=labels',
			context:ctx,
			success:function(data,resp){
				ret = data;	
			},
			/**
			error:function(code,resp){
					///console.log(resp.responseText);
					dest.error = new ErrorView(resp.responseText);	
			}
			*/
		}, options));
		return ret;
	},
    loadLabels:function(ctx, options)
	{
		thisO = this;
        $.ajax(_.extend({
			url:this.url+'?action=labels',
			success:function(data,resp){
				ctx[options.key] = data;
                thisO.trigger('change:labels');	
			},
			/**
			error:function(code,resp){
					///console.log(resp.responseText);
					dest.error = new ErrorView(resp.responseText);	
			}
			*/
		}, options));
	},
    /**
    loadModelLabels:function(dest, ctx, options)
	{
		thisO = this;
        $.ajax(_.extend({
			url:this.url+'?action=labels',
			success:function(data,resp){
				ctx[options.key] = data;
                thisO.trigger('change:labels');	
			},

		}, options));
	},
    */
});
});

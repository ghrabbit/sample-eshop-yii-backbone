define(function (require) {
	var Backbone = require('backbone');
	var App = require('application');
    
    var Helper = function(options) {
      options || (options = {});
      this.initialize.apply(this, arguments);
    };
    
    _.extend(Helper.prototype, Backbone.Events, {
	/**
    defaults:{
	  type:  'labelsLoaader',
      title: 'Labels Loaader',
	},
    */
	initialize: function(options) {
		options || (options = {});
		if(options.url) this.url = options.url;
	},
    labels:function(key, handler, ctx, options)
	{
	  if(!App.Labels[key]) 
      {
        this.once('change:labels', handler, ctx); 
        ///model.loadLabels(App.Labels, {error:this.onError, key:'contact'});
        thisO = this;
        $.ajax(_.extend({
			url:key+'/model?action=labels',
			success:function(data,resp){
				App.Labels[key] = data;
                thisO.trigger('change:labels');	
			},
		}, options));
      }else handler.apply(ctx, arguments);
	},
  });
  return Helper;
});

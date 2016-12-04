define(function (require) {
  var Product = require('models/product'); 
  var ErrorView = require('views/document/error'); 
  var CartItem = Backbone.Model.extend({
    url : 'shopping/model',  
  });	
  
return Backbone.Collection.extend({

    model: CartItem,
    initialize:function(options)
	{
	  options || (options = {});
      ///[{qty:...,product:...}]
      var ctx = this;
	  this.fetch({
		url: 'shopping/cart',
		dataType: 'json',
		success: function(model, resp, options) {
		  ctx.error = false;
		},
		error: function(model,resp) {
		  ctx.error =	new ErrorView({ message: 'Fetch '+ctx.title+' failed:'+resp.responseText+'.' });
		}
	  });
	},		
  });
});

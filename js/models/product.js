define(function (require) {
	var App = require('application');
	var Dictionary = require('models/document/dictionary');
return Dictionary.extend({
	
    type: 'product',
    title: 'Product',
    url: 'product/model',	
	proxy : function()
	{
		clone = this.toJSON();
		//clone.fprice = function() { return this.price;}
        clone.fprice = function() { return this.price;}
		return clone;
	},
	
	cartProxy : function(options)
	{
		/*
		var clone = this.toJSON();
		clone.fprice = function() { return this.price;}
		clone.fqty = function() { return App.cart.get('items')[this.id]; }
		clone.ftotal = function() { return this.fprice() * this.fqty();}
		return clone;
		*/
		return _.extend(_.extend(this.toJSON(),{
			fprice:function() { return this.model.price;},
			fqty:function() { return App.cart.get('items')[this.model.id]; },
			ftotal:function() { return this.model.price * App.cart.get('items')[this.model.id];},
		}),options);
	},
    
    loadLabels:function(labels, options)
	{
        thatA = this;
		$.ajax(_.extend({
			url:this.url+'?action=labels',
			success:function(data,resp){
              labels.product = data;
              thatA.trigger('change:labels');	
			},
			/**
			error:function(code,resp){
					///console.log(resp.responseText);
					dest.error = new ErrorView(resp.responseText);	
			}
			*/
		}, options));
	},

});
});

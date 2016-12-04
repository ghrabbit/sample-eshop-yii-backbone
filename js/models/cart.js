define(function (require) {
	///var Backbone = require('backbone');
  var Products = require('collections/catalog/products');
  var Dictionary = require('models/document/dictionary');
  var Product = require('models/product');  
  var ErrorView = require('views/document/error'); 
  var CartItem = Backbone.Model.extend({
    idAttribute: '_id',
    total:function() {
      return   this.get('qty')*this.get('product').price;    
    }  
  });	
  var CartItems = Backbone.Collection.extend({
	///title: 'items',	
    model: CartItem,
    url: 'shopping/model',
	initialize:function(options)
	{
		options || (options = {});
        /**
        if(options.items)
        {
		  for(key in options.items) { 
            item = new CartItem;
            item.qty = options.items[key].qty;
            item.product = new Product;
            item.product.set(options.items[key].product); 
            this.push(item);
          } 
        }
        */ 
	},		
  });
    
return 	Dictionary.extend({
    defaults:{
      type: 'cart',
      title: 'Cart',
	},
    url: 'shopping/model',
	size:function() {
		return this.collection.size();
	}, 
    initialize: function(options) {
      this.collection = new CartItems;
      
      options || (options = {});
      ctx = this;
      ///console.log('BEFORE cart attributes: '+JSON.stringify(this.attributes));
      ///this.fetch({
          
      this.collection.fetch({ 
        success: function(data, resp) {
          ///console.log('cart INIT FETCH data: '+JSON.stringify(data));
          ctx.trigger('change');  
          ///if(ctx.collection.models.length > 0) 
          ///  console.log('AFTER cart INIT success: '+JSON.stringify(ctx.collection.models[0]));
        },
        error: function(code,resp) {
          ///console.log('Could not fetch cart data.Response:'+resp.responseText);
          ///if(options.ctx && options.onFetchError)
            ///options.onFetchError(options.ctx, code, resp); 
          ctx.error =	new ErrorView({ message: 'Fetch '+ctx.title+' failed:'+resp.responseText+'.' });  
        }
      });
      ///console.log("cart after initialized:"+(this.collection != undefined));
      ///console.log('AFTER cart attributes: '+JSON.stringify(this.attributes));
      
    },
	add:function(id, qty) { 
		ctx = this;
        ///item = ctx.collection.where({_id:id},true);
        
        item = ctx.collection.get(id);
        
        $.ajax({
          url: 'shopping/cartAdd', // JQuery loads serverside.php
		  data:{id:id,qty:qty},
          dataType: 'json', // Choosing a JSON datatype
		  success: function(data) // Variable data contains the data we get from serverside
		  {
			///console.log('cart ADD: data '+JSON.stringify(data));
            ///console.log('cart add: data '+JSON.stringify(item));
                    ///reset cart attributes
                    ///ctx.set(data);
                    ///ctx.set('total', data.total);
                    ///ctx.collection = new CartItems({items:data.items});
            ///item.set("qty",data.qty);        
            ///item.set("product", new Product(data.product));
            if(!item) {
              item = new CartItem;
              item.set(data); 
              ///console.log('cart add: NEW ITEM '+JSON.stringify(item)); 
              ctx.collection.add(item); 
            }else {
              ///console.log('cart add: ITEM '+JSON.stringify(item));  
              item.set("qty",data.qty); 
              if(item.get('qty') < 1)  
                ctx.collection.remove(item);  
            }  
            console.log('cart AFTER add: ITEM '+JSON.stringify(item)); 
            ctx.trigger('change', item.get("qty"));
		  },
          error: function(code,resp) {
			///console.log('Could not ADD TO cart data. Response:'+resp.responseText);
            ctx.error = new ErrorView({ message: [{reason:'Could not ADD to cart data.'},{resp:resp.responseText}] });
          }  
        });
		///console.log('CALL ADD CART id:'+id);
	},
	remove:function(id) { 
		ctx = this;
		item = new CartItem;
        item.fetch({ 
				url: 'shopping/cartRemove', // JQuery loads serverside.php
				data:{id:id},
				dataType: 'json', // Choosing a JSON datatype
				success: function(data) // Variable data contains the data we get from serverside
				{
					///reset cart attributes
                    ///ctx.set(data);
                    ///ctx.set('total', data.total);
                    ///ctx.collection = new CartItems({items:data.items});
                    ctx.collection.remove(item);
                    ctx.trigger('change');
				}
		});
		///console.log('CALL ADD CART id:'+id);
	},

	itemcount:function() { 
	  ///console.log('cart attributes: '+JSON.stringify(this.attributes));
      var all = 0;
      ///console.log('cart collection:'+JSON.stringify(this.collection.toJSON()));
      ///if(this.collection == undefined)
        ///this.collection = new CartItems;
      this.collection.each(function(element){
        all += Number(element.get('qty'));  
        ///console.log('cart Number(qty):'+Number(element.get('qty'))+' qty:'+element.get('qty'));
      });
      ///console.log('cart count ALL:'+all);
	  return all; 
	},
	ftotal: function() { 
      total = 0;
      this.collection.each(
            function(elem) {
              ///console.log('cart collection item:'+JSON.stringify(elem.toJSON()));  
              ///total += elem.get('qty')*elem.get('product').price; 
              total += elem.total();   
            }  
      );
      return total;
    ///{ return this.attributes['total']?this.attributes['total']:0;	
    },
	proxy : function(options)
	{
		options || (options = {});
		///clone = {};
		clone = this.toJSON();
        ///console.log('CART CLONE '+JSON.stringify(clone));
		///clone.model.itemcount2 = function() { return JSON.stringify(this); };
		clone.itemcount = this.itemcount();/**function() { 
			all = 0;
			for(key in this.items) { all += this.items[key]; }
			return all; 
		};*/
		clone.ftotal = this.ftotal();/**function() { return this.total?this.total:0;	};*/
		for(key in options) { clone[key] = options[key]; }
		return clone;
	},
    /**
    getProducts:function() {
      /// return array of products 
      var products = new Array(this.collection.size());
      var i=0;
      this.collection.each(
            function(elem) {
              product = new Product;  
              product.set(elem.get('product'));
              products[i++] = product;
            }  
      );   
      return products;   
    } 
    */    
});
});

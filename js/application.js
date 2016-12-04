define(function (require){
	var App = {
		router : false,
		user:false,
		cart:false,
		checkout:false,
		Labels: {},
        _Labels: { 
          _category: [
            ['id' ,'ID'],
		    ['parent_id' ,'Parent'],
		    ['title' ,'Title'],
		    ['description' ,'Description'],
		    ['img_file' ,'Image'],
		    ['subCategories' ,'Subcategories'],
		    ['products' ,'Products'],
		    ['catalog' ,'Catalog'],
          ],  
          _product : [
            ['id' ,'ID'],
		    ['title' ,'Title'],
		    ['description' ,'Description'],
		    ['img_file' ,'Image'],
		    ['price' ,'Price'],
		    ['on_special' ,'On Special'],
		    ['categories' ,'Categories'],
		    ['products' ,'Products'],

		    ['productDetails' ,'Product Details'],
		    ['addToCart' ,'Add to Cart'],
		    ['image' ,'Image'],
          ],
          _cart : [
            ['shopping','Shopping'],
		    ['shopping-cart','Shopping Cart'],
		    ['qty','Qty'],
		    ['total','Total'],
		    ['grand-total','Grand Total'],
		    ['price' ,'Price'],
		    ['purchase-now','Purchase Now'],
			
		    ['product' ,'Product'],
		    ['productDetails' ,'Product Details'],
		    ['addToCart' ,'Add to Cart'],
		    ['addUnitToCart' ,'Add unit to Cart'],
		    ['removeUnitFromCart' ,'Remove unit from Cart'],
		    ['removeFromCart' ,'Remove from Cart'],
		    ['image' ,'Image'],
		    ['title' ,'Shopping Cart'],
          ],
        },
		lang:null,
        initLabels:function(viewName, labels) {
          if(!this.Labels[viewName]) {
            var ret = {};
            for(l in labels)
            {
              src = labels[l];
              if(this.messages && (dst = this.messages.get(src[1]))) 
              {
                ret[src[0]] = dst.attributes.value;    
              }else  
                ret[src[0]] = src[1]; 
            }
            this.Labels[viewName] = ret;
          }    
    },
        run:function() {
          Backbone.history.start();   
        },
	};
	return App;
});


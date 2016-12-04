define(function (require) {
	var Backbone = require('backbone');
	return Backbone.Model.extend({
	url : "home/language",
	defaults: {
		"id":  "ru_ru",
	},
    helper:{
      success:function(model, resp, options){
					///console.log('LANG CHANGE SUCCESS resp='+JSON.stringify(resp));
                    model.trigger('change', options);	
	  },
      error:function(code, resp){
                    ///console.log('LANG CHANGE ERROR code=:'+JSON.stringify(code) + ' resp='+JSON.stringify(resp));
                    
                    one.trigger('change-error', {error:resp.responseText}); 
	  }    
    },
	initialize:function()
	{
		one = this;
        this.fetch(this.helper);
	},
	current:function()
	{
		cur = this.get('id');
		return cur?cur:this.defaults.id;
	},
	setCurrent:function(lang, options)
	{
		///console.log("LANG CHANGE: TRY Set current language to "+lang + ' current='+this.get('id'));
        if(!lang) return false;
		if(lang == this.get('id')) return false;
		///console.log("LANG CHANGE: Set current language to "+lang);
        one = this;
        /***/
		this.set('id',lang);
        this.save({
				///patch: true,
                ///data:{id:lang}, 
                success:function(model, resp){
					///console.log('LANG CHANGE SUCCESS model='+JSON.stringify(model)+' resp='+JSON.stringify(resp));
                    ///one.trigger('change', options);	
				},
                
                error:function(code, resp){
                    console.log('LANG CHANGE ERROR code=:'+JSON.stringify(code) + ' resp='+JSON.stringify(resp));
                    
                    one.trigger('change-error', {error:resp.responseText}); 
				}
                
		});
        
        /**/
        /**
        $.ajax({ method:'put', data: {id:lang}, url:this.url,
				///patch: true,
                success:function(data, resp){
					console.log('LANG CHANGE SUCCESS data='+JSON.stringify(data) +' resp='+JSON.stringify(resp));
                    ///one.trigger('change', options);	
                    one.set('id',lang);
				},
                error:function(code, resp){
                    console.log('LANG CHANGE ERROR code=:'+JSON.stringify(code) + ' resp='+JSON.stringify(resp));
                    
                    one.trigger('change-error', {error:resp.responseText}); 
				}
                
		});
        */ 
	},
	toMustache:function()
	{
		ret = {};
		ret.current = this.current();
		ret.support = [{"id":"ru_ru","title":"русский"},{"id":"en_us","title":"american"}];
        idx  = _.findIndex(ret.support, {"id":ret.current});
        ret.title = idx >= 0? ret.support[idx].title:'unknown'; 
		return ret;
	},	
});
});

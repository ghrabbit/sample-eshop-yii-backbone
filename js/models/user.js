define(function (require) {
	var Backbone = require('backbone');
    var App = require('application');
	return Backbone.Model.extend({
	url : "account/user",
	username:function() {
      if(this.is_logged_in())
        return  this.get('username');
      else {
        found = App.messages?App.messages.get('guest'):false;
        if(found)  
          return found.attributes.value;  
        else return 'guest'; 
      }   
	},	
	initialize:function() { this.refresh(); },
    refresh:function(options) {
	  options || (options = {});
	  url = options.url?options.url:this.url;
	  var ctx = this; 
	  $.ajax({ /// ajax call starts
				url: url, 
				dataType: 'json', 
				success: function(data) 
				{
                    ctx.set(data);
                    ctx.trigger('change:authenticated', ctx, data['authenticated']);
				}
	  });
	  return	this;
	},	
	
	is_logged_in: function(){
		return	this.get('authenticated');
	},
	
	logout: function(){
		return this.refresh({url:'account/logout'});
	},
	
	has_priv: function(role) {
		return false;
	},
});
});

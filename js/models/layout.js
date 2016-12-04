define(['backbone'],function (Backbone) {
return 	Backbone.Model.extend({
	test: false,
	initialize: function(options) {
	},
	/**
	//authenticated:false,
	is_logged_in: function(){
		var ctx = this; 
		$.ajax({ // ajax call starts
				url: 'account/isLoggedIn', // JQuery loads serverside.php
				dataType: 'json', // Choosing a JSON datatype
				success: function(data) // Variable data contains the data we get from serverside
				{
					ctx.set({authenticated : data['authenticated']});
                    ctx.trigger('change'); 
				}
		});
		//console.log("is_logged_in authenticated="+ctx.get('authenticated'));
		return	ctx.get('authenticated');
	},
	
	logout: function(){
		var ctx = this; 
		$.ajax({ // ajax call starts
				url: 'account/logout', // JQuery loads serverside.php
				dataType: 'json', // Choosing a JSON datatype
				success: function(data) // Variable data contains the data we get from serverside
				{
					ctx.set({authenticated : data['authenticated']});
                    ctx.trigger('change'); 
				}
		});
		//console.log("is_logged_in authenticated="+ctx.get('authenticated'));
		return	ctx.get('authenticated');
	},
	 
	has_priv: function(role) {
			return false;
	}, 
	*/
	
	widget: function(viewType,arg) {
		var view = new viewType({arg:arg}); 
		if(view){
			var ret = view.render();
			return ret;
		}	
	}	

});
});


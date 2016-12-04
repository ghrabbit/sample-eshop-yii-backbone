define(function (require) {
	var Backbone = require('backbone');
	return Backbone.Model.extend({
	url:'home',	
	initialize:function(options)
    {
		options || (options = {});
		if(options.url)
			this.url = options.url;
		this.refresh();	
	},
	
	refresh:function() {
		var ctx = this;
		$.ajax({ /// ajax call starts
				url: this.url+'/captcha?refresh=1', /// JQuery loads serverside.php
				dataType: 'json', /// Choosing a JSON datatype
				success: function(data) /// Variable data contains the data we get from serverside
				{
					///console.log("DATA="+JSON.stringify(data));
					ctx.set(data);
                    ctx.trigger('chnge'); 
				}
		});	
		return this;
	},
	
	
});
});

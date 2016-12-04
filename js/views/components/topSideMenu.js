define(function (require) {
	return Backbone.View.extend({
	app:false,
    initialize: function(app = false) {
		this.app = app;
		var ctx = this; 
        /// load template and render if success
		$.ajax({ // ajax call starts
			url: 'ajax/jst', // JQuery loads serverside.php
			data: 'id='+this.app.router.layout().topSideMenu(), // Send value of the clicked button
			dataType: 'html', // Choosing a JSON datatype
			success: function(data) // Variable data contains the data we get from serverside
			{
				ctx.template = _.template(data);
				//console.log("App-Header.jst="+data);
                ctx.render();
			},
			error: function(xhr, str) {
				new Error({ message: "Error loading panel/topsideMenu via ajax" });
				//console.log('Fetch on special products failed');
			},
		});	
	},
	
	render: function() {
		$(this.el).html(this.template({model:false}));
    },
    
    getHtml: function() {
	  return $(this.el).html();    
    },
 
	
});
});

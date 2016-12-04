///App.Views.Notice = 
define([
	'jquery',
	'underscore',
	'backbone',
	'views/document/notice',
	'text!templates/documents/errorSummary.mustache',
	'text!templates/documents/noticeSummary.mustache',
	'mustache',
	],function ($, _, Backbone, Notice, ViewTemplate, NoticeTemplate, Mustache) {
	
	return Notice.extend({
    className: "error",
    defaultMessage: 'Uh oh! Something went wrong. Please try again.',
    initialize:function(options)
    {
		options || (options = {});
		if(options.message)
			this.message = options.message;
		if(options.prompt)
			this.prompt = options.prompt;
		this.template = options.notice?NoticeTemplate:ViewTemplate;	
	},
	render: function() {
       
        errors = new Array();
        if( (this.message instanceof Array) || (this.message instanceof Object))
		{
			var i = 0;
			for (var key in this.message ) 
			{
				item = new Array;
				item['attribute'] = key;
				item['value']=this.message[key];
				errors[i] = item; 
				i++;
			}
		}	
		else
			errors[0] = {attribute:"Error", value:this.message}; 
        $(this.el).html(Mustache.render(this.template, {errors:errors, prompt:this.prompt}));
        
        return this;
    }	
});
});



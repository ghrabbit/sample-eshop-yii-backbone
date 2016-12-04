//App.Views.Notice = 
define([
	'jquery',
	'underscore',
	'backbone',
	'jqueryDoTimeout',
	'application',
   	'text!templates/documents/notice.mustache',
	'mustache',
	],function ($, _, Backbone, jqueryDoTimeout, App, NoticeTemplate, Mustache) {

return Backbone.View.extend({
    className: "success",
    displayLength: 10000,
    defaultMessage: '',
    defaultPrompt: 'Attention',
    template:_.template("<div class=\"alert alert-info\"><%=message%></div>"),
    initialize: function(options) {
        options || (options = {});
        this.message = options.message?options.message:undefined || this.defaultMessage;
        this.prompt = options.prompt?options.prompt:undefined || this.defaultPrompt;
    },
    
    render: function() {
        $(this.el).html(Mustache.render(NoticeTemplate, {message:this.message, prompt:this.prompt}));
        return this;
    },
	
	play: function(redirectTo) {
        var ctx = this;
		$(this.el).slideDown();
        
        $.doTimeout(this.displayLength, function() {
            $(ctx.el).slideUp();
            $.doTimeout(ctx.displayLength - 100, function() {
                ctx.remove();
				if(redirectTo)
					App.router.navigate(redirectTo, {trigger: true});
            });
		});
         
        return this;
    },
    
    otherPlay: function(ctx, redirectTo) {
        that = this;
        $(ctx.el).hide();
        $(ctx.el).html(this.render().el);
		$(ctx.el).slideDown();
        $.doTimeout(this.displayLength, function() {
            $(ctx.el).slideUp();
            $.doTimeout(that.displayLength - 100, function() {
                ctx.remove();
				if(redirectTo)
					App.router.navigate(redirectTo, {trigger: true});
            });
		});
        return this;
    }
});
});


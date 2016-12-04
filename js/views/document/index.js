//Document index
define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'mustache',
	'views/document/error'
	],function ($, _, Backbone, App, Mustache, ErrorView) {

return Backbone.View.extend({
	title: '???',
	error:false,
    config:{},
    url:false,
    initialize: function() {
        if(this.preInit(this.config)){
            this.load(this.config);
        }    
		this.postInit(this.config);
        this.url = Backbone.history.getFragment();
	},
	onError:function(code, resp){
		this.error = new ErrorView(resp.responseText?resp.responseText:resp);	
	},
	onFetch:function(options) {
		ctx = this;
		this.model.fetch({
				url: options.urlParams?this.model.url+'/?'+options.urlParams:this.model.url,
				success:function(model, resp){
                    ctx.trigger('change');
				},
				error: function(xhr, resp) {
					ctx.error = new ErrorView({ message: resp.responseText });
				},
			});
	},
	onCreate:function(options) {
		ctx = this;
		this.model.save(null,
			{
				success:function(model, resp){
                    ctx.trigger('change');
				},
				error: function(xhr, resp) {
					ctx.error = new ErrorView({ message: resp.responseText });
				},
			}	
		);
	},	
    load: function(options) {
		options || (options = {});
		if(options.template) {
			this.setTemplate(options.template, this);
		}
          
		if(this.model) {
            
			if(options.fetch) 
			{
				this.model.on('change',this.onModelChange,this);
                if(this.model.isNew() && (this.model.idAttribute=='id'))
					this.onCreate(options);
				else
					this.onFetch(options);
			}
		}	
		return this;	
	},
    onModelChange:function() {
      this.render();   
    },
    
	preInit:function(options) { return true;},
	postInit:function(options) {},
	
	renderInline: function(yemplate) {
		return Mustache.render(yemplate);
	},
    renderInternal: function() {
		
		$(this.el).html(this.template(this.model.attributes));
		if(this.error)
			this.$('.errorSummary').html(this.error.render().el);
		this.delegateEvents();
		return this;
    },
    
    render: function() {
      return this.renderInternal();
    },
	
	
	setTemplate: function(path, ctx, options) {
        ctx.template = function(_options, _pertials) {
			return Mustache.render(path, _options, _pertials);
		};
	},
	reload: function() {
      return new this.constructor();
    },
			
});
});

define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'views/document/error',
	],function ($, _, Backbone, App, ErrorView) {
	var Model =  Backbone.Model.extend({
		event:null,
		initialize:function(options)
		{
			options || (options = {});
			if(options.event) this.event = options.event;
			///this.data = { label:this.node.get('name')};	
		}
	});
	var ModelView = Backbone.View.extend({
		events: {
			"click": "activateNode",
			///"click .breadcrumbs-node-label": "activateNode",	
			///"click .breadcrumbs-node": "activateNode",	
		},	
		tagName:'li',
		className:"breadcrumbs-node",
		template: _.template("<span class=\"breadcrumbs-node-label\"><%=label%></span>"),
		initialize:function(options)
		{
			options || (options = {});
			this.model = options.model;
		},
		render:function(options) {
			options || (options = {});
			
			if(this.model.event.getId()==0)
			{
				if(options.open)
					$(this.el).html("<span class=\"glyphicon glyphicon-folder-open\"></span>");
				else
					$(this.el).html("<span class=\"glyphicon glyphicon-folder-close\"></span>");
			}else {
                $(this.el).html(this.template({label:this.model.event.label()}));
            }    
			this.delegateEvents();
			return this;
		},
		activateNode:function() 
		{
			this.model.event.trigger('activate', this.model.event, {render:true, history:true});
		},		
	});	
	var Collection =  Backbone.Collection.extend({
		model:Model,
	});
return Backbone.View.extend({
	///error:false,
    template: '<ol class=\"breadcrumb\"></ol>',
	///itemTemplate:'<li><a href="<%=url%>"><%=label%></a></li>',
	collection: new Collection(),
	push : function(node)
	{
		this.collection.push(new Model({event:node}));
        node.on('readyToRender', this.render, this);
	},
	
	last : function()
	{
		model = this.collection.last();
		return model?model.event:null;
	},
	
	
	isLast : function(id)
	{
		model = this.collection.last();
		return model.event.getId() == id;
	},
	
	initialize: function(options) 
	{
		this.collection = new Collection();
	},
	
	render: function(options) {
		$(this.el).html(this.template);
		
		this.collection.each(this.addOne, this);
		this.$('li').last().toggleClass('active');
        this.delegateEvents();
		return this;
    },
	
	addOne: function(model) {
		view = new ModelView({model:model});
		this.$(".breadcrumb").append(view.render({open:this.collection.models.length==1}).el);
	},
    
	cut: function(/**event*/id, before) {
		///before || (before = 0);
		while(this.collection.length)
		{
			if((before != undefined) &&
				(before == this.collection.last().event.getId()))
				break;
			model = this.collection.pop();
			if(/**event*/id === model.event.getId())
					return model.event;
		}
		return null;
	},
	
	find: function(id) {
		found = _.find(this.collection.models, function(model){ 
			return model.event.getId() == id; 
		});
		return found?found.event:null;
	}	
   
});
});

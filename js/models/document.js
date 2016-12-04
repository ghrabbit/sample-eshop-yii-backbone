var Document = Backbone.Model.extend({
	test: false,
	url : function() {
	var base = 'documents';
	if (this.isNew()) ///return base;
		return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + 'create';
	return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + 'do/'+this.id;
	//return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;	    
	}

});

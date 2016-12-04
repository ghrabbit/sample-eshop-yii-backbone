define(function (require) {
	var Dictionary = require('models/document/dictionary');
return 	Dictionary.extend({
		/**
		defaults:{
				id: 0,
                name: 'Категория',
				parent_id: null,
				description:'',
				img_file:''
		},
		*/
	url : 'category/model',
    loadLabels:function(ctx, options)
	{
	    ///console.log('TRY LOAD App.Labels.category');
        
        thisOne = this;
        /**
        $.ajax(_.extend({
			url:this.url+'?action=labels',
			success:function(data,resp){
              ctx.category = data;	
              thisOne.trigger('change');
			},
		}, options));
        */
        $.ajax({
			url:this.url+'?action=labels',
			success:function(data,resp){
              ///console.log('TRY LOAD App.Labels.category SUCCESS');  
              ctx.category = data;	
              ///if(options.view) options.view.labelsReady();
              ///var events = thisOne._events['lab'];
              ///if(events)  console.log('TRY LOAD App.Labels.category HAS event LAB'); 
              thisOne.trigger('lab');
              ///console.log('TRY LOAD App.Labels.category SUCCESS after called trigger'); 
			},
			error:function(code,resp){
					console.log(resp.responseText);
					///dest.error = new ErrorView(resp.responseText);	
			}
        }); 
	},
});
});

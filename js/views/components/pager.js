define([
	'jquery',
	'underscore',
	'backbone',
	'application',
	'views/document/error',
	],function ($, _, Backbone, App, ErrorView) {

return Backbone.View.extend({
	error:false,
    ///template: '<ul class="pagination pull-right"></ul>',
    tagName:'ul',
    className:'pagination pull-right',
	limit:5,
	totalCount:0,
	bookSize:0,
	pageNo:1,
	pageSize:6,
	page:null,
	events: {
		"click": "changePage",	
	},	
	
	render: function() {
		///console.log("PAGER: do RENDER");
		bookSize = this.bookSize > this.limit ? this.limit : this.bookSize;
		///if(bookSize <= 1) return this;
        offset = ((this.pageNo % this.limit) - (this.pageNo % this.limit)) * this.limit + 1;
		///console.log("PAGER: do RENDER bookSize="+bookSize+" offset="+offset);
        
        
        $(this.el).html('');
		pag = $(this.el);///this.$('.pagination');

		if(this.pageNo == 1)
		  pag.append('<li class="disabled"><span class=\"pageNo pagePrev\">Prev</span></li>')
		else pag.append('<li><span class=\"pageNo pagePrev\">Prev</span></li>')
			
		
        for(i = 0; i < bookSize; i++ )
		{
				
				if(this.pageNo == (offset+i))
					pag.append('<li class="active"><span class=\"pageNo\">'+(offset+i)+'</span></li>');
				else
					pag.append('<li><span class=\"pageNo\">'+(offset+i)+'</span></li>');
		}
		if(this.pageNo == this.bookSize)
				pag.append('<li class="disabled"><span class=\"pageNo pageNext\">Next</span></li>');
		else pag.append('<li><span class=\"pageNo pageNext\">Next</span></li>');
		this.delegateEvents();
		return this;
    },
    
    safeRender:function()
    {
       ///console.log("PAGER: SAFE RENDER this.bookSize="+this.bookSize); 
       this.render();
    },
    
    setBooksize:function() {
      rem = this.totalCount % this.pageSize;
	  this.bookSize = 	((this.totalCount -  rem) / this.pageSize) + (rem?1:0);
    },
    
    initialize: function(options) {
		options || (options = {});
		this.page = options.page;	
		if(options.totalCount)	
			this.totalCount = options.totalCount;
		if(options.pageNo)	
			this.pageNo = Number(options.pageNo);	
		
        ///this.setBooksize = function() {
        ///  rem = this.totalCount % this.pageSize;
	    ///  this.bookSize = 	((this.totalCount -  rem) / this.pageSize) + (rem?1:0);
          ///console.log("PAGER: INITIALIZE thisbookSize="+this.bookSize);
        ///};
        if(options.url)
		{
			///console.log("options:"+JSON.stringify(options));
			///this.on('change:totalCount', this.render);
            this.on('change', this.safeRender, this);
            this_One = this;
			$.ajax({ /// ajax call starts
				url: options.url,
				data:options.data,
				dataType: 'json', // Choosing a JSON datatype
                ///async:false,
				success: function(data, resp) // Variable data contains the data we get from serverside
				{
					///console.log("PAGER AJAX: url="+options.url + " DATA="+JSON.stringify(data));
					this_One.totalCount = Number(data['totalCount']);
                    ///ctx.trigger('change:totalCount');
                    this_One.setBooksize();
                    ///rem = that.totalCount % that.pageSize;
	                ///that.bookSize = 	((that.totalCount -  rem) / that.pageSize) + (rem?1:0);
                    this_One.trigger('change');
				},
				error: function(resp)
				{
					///console.log("RESP="+JSON.stringify(resp));
					this_One.error = new ErrorView({ message: resp.responseText });
				}
			});
		} else {
          ///console.log("PAGER: empty url");
		  this.setBooksize();
		}
        ///console.log("PAGER: do RENDER this.bookSize="+this.bookSize+" this.totalCount="+this.totalCount);			
	},    
    
	changePage : function(ev) { 
		///get target html element	and number as pageNo
		el = $(ev.target);
		if(el.hasClass( "pageNext" ))
			pageNo = "next";
		else if(el.hasClass( "pagePrev" ))
			pageNo = "prev";
		else
			pageNo =  el.html();
		this.setPage(pageNo);
		///console.log('PAGE CLICKED pageNo={'+ pageNo +'}');
	},		
	
	setPage: function(id) {
		///console.log('SET page to {'+id + "} current pageNo="+this.pageNo);
		if(id == "next")
			return this.setPage(this.pageNo + 1);
		if(id == "prev")
			return this.setPage(this.pageNo - 1);
		if((id<=0) || (id>this.bookSize) || (this.pageNo == id)) {
			///console.log('SET page to '+id+' failed: out of limit');
			return false;
		}	
		///(this.pageNo != id)
		///console.log('SET page to '+id);
		this.pageNo = Number(id);
		///sync with page
		this.page.pageChanged();
		return true;
	},
   
});
});

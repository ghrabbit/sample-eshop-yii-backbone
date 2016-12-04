define([	
	'jquery',
	'underscore',
	'backbone',
	'application',
	'views/layout',
	'views/home/index',
	'views/home/about',
	'views/account/login',
	'views/account/signup',
	'views/account/password',
	'views/account/forgotPassword',
	'views/account/settings',
	'views/home/contact',
	'views/shopping/catalog',
	'views/shopping/product/details',
	'views/shopping/category/index',
	'views/shopping/product/index',
	'views/shopping/cart/document',
	'views/shopping/purchase/document',
    'collections/messages',
    'models/language',
	], function ($, _, Backbone, App, Layout,
		HomeIndex, About, Login, Signup, Password, 
		ForgotPassword, Settings,  Contact, Catalog, 
		ProductDetails, CategoryIndex, ProductIndex, 
		CartDocument, PurchaseNowDocument, Messages, Language) 
 {
    return Backbone.Router.extend({
	
	routes: {
		"":                        		 "index",
		"index":                         "indexlayout",
		"home":							"index_home",
		"lang-:lang(/:other)": 			"langroute",
		"home/about": 					"about",
		"contact": "contact",
		"home/contact": "contact",
		"account/settings": "settings",
		"settings": "settings",
		"account/login": "login",
		"login": "login",
		"account/logout": "logout",
		"logout": "logout",
		"account/signup":"signup",
		"signup":"signup",
		"account/password":"password",
		"password":"password",
		"account/forgotPassword":"forgotPassword",
		"forgotPassword":"forgotPassword",
		"shopping":                     							"shopping_catalog",
		"shopping/catalog":                     							"shopping_catalog",
		"shopping/category/:id(/pn:pageNo)":   					"shopping_catalog",
		"shopping/category/:id/products(/pn:pageNo)":  		"shopping_catalog_products",
		
		"shopping/onspecials":								"shopping_catalog_onSpecials",
		"shopping/onspecials/pn:pageNo":				"shopping_catalog_onSpecials",
		
		///"shopping/categoryDetails/:id":					"shopping_categoryDetails",
		"shopping/productDetails/:id":					"shopping_productDetails",
		"shopping/cartAdd/:id(/:qty)":					"shopping_cartAdd",
		"shopping/cartRemove/:id":						"shopping_cartRemove",
		"shopping/cart(/pn:pageNo)":					"shopping_cart",
		"shopping/purchaseNow":							"shopping_purchaseNow",
	},
	layout: false,
    
    mytrace:function() {
      console.log('FRAGMENT='+Backbone.history.getFragment());    
    },
	
	initialize: function() {
        if (!App.lang) {
		  App.lang = new Language;
          App.lang.on('change', this.resetLang, this);
          App.lang.on('change-error', this.resetLangError, this);
        }
        this.layout = new Layout(); 
	},

    
	index: function(arg) {
		this.shopping_catalog_onSpecials();
		Backbone.history.navigate('#'+arg?arg:'');
    },
    indexlayout: function() { this.index('index'); },
    index_home: function() { this.index('home'); },
    
    checklayout:function(arg) {

		if(arg) this.layout.renderPartial(arg);
		else console.log("TRY render undefined PAGE ");
	},
	
	checklayout_call:function(arg) {
		
		if(!this.layout) {
			this.layout = new Layout(); 
		}

		if(arg) this.layout.renderPartial(arg());
	},

	resetMessages:function(){
      this.layout.refresh();   
    },
    
	resetLang: function(options){
      App.messages = new Messages({lang:App.lang.get('id')});
      App.messages.once('change', this.resetMessages, this);
      App.Labels = App._Labels;
      Backbone.history.navigate(this.layout.getUrl());
    },
    resetLangError: function(options){
      ///this.error = new ErrorView({ message: options.error });    
    },
    langroute: function(lang, other) {
		App.lang.setCurrent(lang, {url:other});
	},
	
	about: function() {
		this.checklayout(new About());
		Backbone.history.navigate('#about');
	},
	
	contact: function() {
		this.checklayout(new Contact());
		Backbone.history.navigate('#contact');
	},
	
	settings: function() {
		this.checklayout(new Settings());
		Backbone.history.navigate('#settings');
	},
	
	login: function() {
		this.checklayout(new Login());
		Backbone.history.navigate('#login');
	},
	
	logout: function() {
		if(App.user) App.user.logout();
		App.router.navigate('#index', {trigger: true});
	},
	
	signup: function() {
		this.checklayout(new Signup());
		Backbone.history.navigate('#signup');
	},
	
	password: function() {
		this.checklayout(new Password());
		Backbone.history.navigate('#password');
	},
	
	forgotPassword: function() {
		this.checklayout(new ForgotPassword());
		Backbone.history.navigate('#forgotPassword');
	},
	
	shopping_catalog: function(id,pageNo) {
		this.catalog || (this.catalog = new Catalog());
        var ci = new CategoryIndex({id:id,pageNo:pageNo,history:true, parent:this.catalog});
        var that = this;
        setTimeout(function(){ that.checklayout(that.catalog.activate(ci)); },0);
	},
	
	shopping_catalog_products: function(id, pageNo) {
		this.catalog || (this.catalog = new Catalog());
        var pi = new ProductIndex({id:id,pageNo:pageNo,history:true, parent:this.catalog});
		var that = this;
        setTimeout(function(){ that.checklayout(that.catalog.activate(pi)); }, 0);
	},
	
	shopping_catalog_onSpecials: function(pageNo) {
		///create homeIndex if need
		///set given(?) pageNo
		///update history
		this.homeIndex || (this.homeIndex = new HomeIndex());
		view = 	pageNo?this.homeIndex.setPage(pageNo):this.homeIndex;
		this.checklayout(view);
	},
	
	///aboundoned
    /**
	shopping_categoryDetails: function(id) {
		///console.log('CALL category details widh id:'+id);
		var Model = require('models/category');
		model = new Model();
		model.fetch({
			data:{id:id},
			success: function(model, resp) // Variable data contains the data we get from serverside
			{
				///console.log("Model is loaded succefully:"+JSON.stringify(model));
                ctx.trigger('change');
			},
			error: function(model,resp)
			{
				console.log("Fetch model is failed:"+JSON.stringify(resp));
			},
		});
		this.checklayout(new CategoryDetails({model:model}));
	},
	*/
	
	shopping_productDetails: function(id) {
		this.checklayout(new ProductDetails({id:id}));
	},
	
	///add qty of product to cart
	shopping_cartAdd: function(id, qty) {
		if(!qty) qty = 1;
		App.cart.add(id, qty);
		destUrl = this.layout.document.current()?this.layout.document.current().url():'#shopping';
		this.navigate(destUrl);
	},
	///remove product from cart
	shopping_cartRemove: function(id) {
		App.cart.remove(id);
		destUrl = this.layout.document.current()?this.layout.document.current().url():'#shopping';
		this.navigate(destUrl);
	},
	
	shopping_cart: function(pageNo) {
		if(!this.cartDocument) this.cartDocument = new CartDocument(); 
		this.checklayout(this.cartDocument.setPage(pageNo));
	},
	
	shopping_purchaseNow: function() {
		this.checklayout(new PurchaseNowDocument());
	},
	

	
});
});

//Layout view
define([ 'jquery', 'underscore', 'backbone', 'application',
// /'models/layout',
'views/document/error', 'views/components/topNavbar', 'models/user',
		'views/components/userMenu', 'models/cart',
		'views/components/cartMenu',
		// /'text!templates/components/footer.mustache',
		'views/components/footer'], function($, _,
		Backbone, App, 
		ErrorView, TopNavbar, User, UserMenu, Cart, CartMenu, FooterView) {
	return Backbone.View
			.extend({
				// /model: new Layout,
				/**
				 * events: { "click #test-button":"dologin", },
				 */
				topNavbar : false,
				topSideMenu : false,
				userMenu : false,
				cartMenu : false,
				///cart: new Cart,
				document : false,
                mklayout:function() {
                  this.topNavbar = new TopNavbar();
				  this.userMenu = new UserMenu();
				  this.cartMenu = new CartMenu();
				  this.footer = new FooterView;

				  App.cart.on("change", this.cartMenu.render, this.cartMenu);  
                },
				initialize : function() {
					if (!App.user) {
					  App.user = new User;
					  ///App.user.once('fetch:success',this.authenticatedRefresh, this);
                    }
                    App.user.on('change:authenticated', this.authenticatedRefresh, this);
					
                    App.cart = new Cart
                    this.mklayout();

					///this.render();
				},

				authenticatedRefresh : function(model, value) {

                    if (this.topNavbar) {
						this.topNavbar.render({
							authenticated : value
						});
					}
					if (this.userMenu)
						this.userMenu.render({
							authenticated : value
						});
				},
				
				render : function(options) {
                    ///console.log('BEGIN MAIN INDEX RENDER');
					/**
					 * ///var widget =_.template("<%=layout.widget(viewType)%>");
					 * if(this.topSideMenu) { if(!App.Views.TopMenu)
					 * App.Views.TopSideMenu =
					 * require('views/components/topSideMenu');
					 * 
					 * panel = widget({layout:this.model, viewType:
					 * App.Views.TopSideMenu}); $("#topsidePanel").html(panel); }
					 */
                     ///{{appName}} : {{pageTitle}}
					$("title").html('Sample EShop backbone/yii');
                    $("#topnav").html(this.topNavbar.render().el);
					$("#userPanel").html(this.userMenu.render().el);
					$("#cartPanel").html(this.cartMenu.render().el);
					$('footer.page-footer').html(this.footer.render().el);

					this.delegateEvents();
					return this;
				},

				renderPartial : function(document) {

					if (this.document)
						this.document.remove();
					this.document = document;

					$('#document').html(document.render().el);
					// /after document rendering
					if (document.title) {
						$('#doc_title').html(document.title);
					}

					// /document.afterRender();
					this.delegateEvents();
					return this;
				},

				refresh : function() {
					// /console.log("TRY refresh index");
                    this.mklayout();
                    
					this.render();
					this.refreshPartial();
					// /window.history.back();
				},

				refreshPartial : function() {
					if (this.document) {
						this.document = this.document.remove().reload();
						$('#document').html(this.document.render().el);

						if (this.document.title) {
							$('#doc_title').html(this.document.title);
						}

						if(this.document.afterRender)
                          this.document.afterRender();
						return this;
					}
				},
                getUrl:function() {
                  return this.document.url;
                }, 
			});
            
});

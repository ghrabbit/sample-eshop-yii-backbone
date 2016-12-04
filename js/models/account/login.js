define(function (require) {
	var Backbone = require('backbone');
    var App = require('application');
    ///var Messages = require('messages/ru/messages');
	return 	Backbone.Model.extend({
		defaults:{
				authenticated: false,
                username: '',///'admin',
				rememberMe:true,
		},
		url: 'login/model',
            /**
             * validation object
             * @see backbone.validation.js
             */
			
            validation: {
                username: {
                    required: true,
                    msg: function() { return App.messages.get('usernameRequired'); } ///'Username is required'
                },
				password: {
                    required: true,
                    msg: function() { App.messages.get('passwordRequired'); } ///'Password is required'
                }
            },
		
        doValidate:function(attrs, options) {
          if(!attrs.username) {
              ///console.log('attrs.username is NOT valid');
              return App.messages.get('usernameRequired');   
          }
          if(!attrs.password) {
              ///console.log('attrs.password is NOT valid');
              return App.messages.get('passwordRequired');   
          }  
          ///console.log('attrs.username is '+attrs.username);
          return null;   
        },	
       
	});
});

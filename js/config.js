"use strict";

/// Define jQuery as AMD module
define.amd.jQuery = true;

requirejs.config({
    baseUrl: 'js',
    paths: {
		jquery: '../assets/bower_components/jquery/dist/jquery.min',
		underscore: '../assets/bower_components/underscore/underscore-min',
		backbone: '../assets/bower_components/backbone/backbone-min',
		json: '../assets/bower_components/json/json2',
		backboneLocalstorage: '../assets/bower_components/backbone.localStorage/backbone.localStorage',
		text: '../assets/bower_components/text/text',
		jqueryDoTimeout: '../assets/bower_components/jquery-dotimeout/jquery.ba-dotimeout.min',
		mustache: '../assets/bower_components/mustache.js/mustache.min',
        bootstrap: '../assets/bower_components/bootstrap/dist/js/bootstrap.min',
    },
    shim : {
        backbone : {
            exports : 'Backbone',
            deps : ['jquery','underscore']
        },
        underscore : {
            exports : '_'
        }
    },
    deps : ['jquery', 'underscore'],
    waitSeconds:15
});

require([
    'application',
    'controllers/router',
    'collections/messages',
], function (App, Router, Messages) {
    
    ///App.messages = new Messages;
    ///App.messages.once('change', App.run, App);
    ///_.extend(App.Labels,App._Labels);
    /** attach router to the app */
    App.router = new Router();
    ///App.run();
	///Backbone.history.start({pushState: true});
    ///
    Backbone.history.start();
});





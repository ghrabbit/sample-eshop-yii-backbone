define([
	'views/document/index',
	'text!templates/home/pages/about.mustache',
	'models/home/pages/about'
	], function ( Document, ViewTemplate, AboutDictionary) {
return 	Document.extend({
	model:new AboutDictionary,
	config:{template:ViewTemplate},
});
});

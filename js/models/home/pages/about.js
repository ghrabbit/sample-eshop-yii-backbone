define(function (require) {
	var Dictionary = require('models/document/dictionary');
	return 	Dictionary.extend({
		defaults:{
			title: 'О сайте',
		},
	});
});

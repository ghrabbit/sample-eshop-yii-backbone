define(function (require) {
	var Dictionary = require('models/document/dictionary');
	return Dictionary.extend({
	///url : 'shopping/checkout',
	url : 'checkout/model',
    idAttribute:'customer',
});
});

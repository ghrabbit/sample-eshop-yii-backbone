define(function (require) {
	var App = require('application');
	var Dictionary = require('models/document/dictionary');
return Dictionary.extend({
  default:{	
    type: 'textPare',
    title: 'textPare',
  },  
  idAttribute:'attribute',
});
});

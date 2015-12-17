var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'pessoa';
	
	// Load the galleries by sortOrder
	view.query('pessoas', keystone.list('Pessoa').model.find().sort('sortOrder'));
	
	// Render the view
	view.render('pessoa');
	 
};

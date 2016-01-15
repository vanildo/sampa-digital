var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	view.query('noticias', keystone.list('Post').model.find());
	view.query('oportunidades1', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'COMPRA' ));
	view.query('oportunidades2', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'VENDA' ));
	
	
	// Render the view
	view.render('index');
	
};

var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	view.query('noticias', keystone.list('Post').model.find());
	view.query('oportunidades1', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'COMPRA' ).where('isAtivo', true).populate('empresa'));
	view.query('oportunidades2', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'VENDA' ).where('isAtivo', true).populate('empresa'));
	view.query('eventos', keystone.list('Evento').model.find());
	
	// Render the view
	view.render('index');
	
};

var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.googlekey = keystone.get('google api key');
	locals.googlesrc = 'https://maps.googleapis.com/maps/api/js?key='+locals.googlekey+'&callback=initMap';

	view.query('noticias', keystone.list('Post').model.find());
	view.query('oportunidades1', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'COMPRA' ).where('isAtivo', true).populate('empresa'));
	view.query('oportunidades2', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'VENDA' ).where('isAtivo', true).populate('empresa'));
	view.query('eventos', keystone.list('Evento').model.find().where('state', 'published')); 
	view.query('empresas', keystone.list('Empresa').model.find());



	// Render the view
	view.render('index');

};

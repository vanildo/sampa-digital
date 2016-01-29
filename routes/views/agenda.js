var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var url = view.req.originalUrl;

	//tipo = url.substr(url.indexOf("?") + 1);

	// Set locals

	// Load the galleries

		view.query('eventos', keystone.list('Evento').model.find().where('state', 'published'));

	/*}else{
		valor = tipo.substr(tipo.indexOf("=") + 1);
		console.log(valor);
		view.query('umaOportunidade', keystone.list('Oportunidade').model.find().where('_id', valor).populate('empresa'));

	}*/

	// Render the view
	view.render('agenda');

};

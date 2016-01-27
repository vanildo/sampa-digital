var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var url = view.req.originalUrl;

	tipo = url.substr(url.indexOf("?") + 1);
	console.log(tipo);

	// Set locals
	locals.section = 'oportunidade';

	// Load the galleries
	if(tipo == "comprar"){
		view.query('oportunidades', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'COMPRA' ).where('isAtivo', true).populate('empresa'));
		console.log("paçocas");
	}else if(tipo == "vender"){
		view.query('oportunidades', keystone.list('Oportunidade').model.find().where('tipoOportunidade', 'VENDA' ).where('isAtivo', true).populate('empresa'));
	}else{
		valor = tipo.substr(tipo.indexOf("=") + 1);
		console.log(valor);
		view.query('umaOportunidade', keystone.list('Oportunidade').model.find().where('_id', valor).populate('empresa'));

	}

	// Render the view
	view.render('oportunidade');

};

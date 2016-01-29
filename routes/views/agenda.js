var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var url = view.req.originalUrl;

		tipo = url.substr(url.indexOf("?") + 1);
		valor = tipo.substr(tipo.indexOf("=") + 1);
		console.log(valor)

		if(valor != '/agenda'){
			console.log('HeLLO')
			view.query('umEvento', keystone.list('Evento').model.find().where('_id', valor));
			
			
		}else{
			console.log('nao fui chamdo:(')
			view.query('eventos', keystone.list('Evento').model.find().where('state', 'published'));			
			
			
		}



	
		
		console.log(valor);

	// Render the view
	view.render('agenda');

};

var keystone = require('keystone');
//var $ = require('jQuery');
var Empresa = keystone.list('Empresa');
var Usuario = keystone.list('Usuario');
var Pessoa = keystone.list('Pessoa');



exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
	var url = view.req.originalUrl;
    locals.section = 'empresa';


    // Load dados empresa

		controlData = url.substr(url.indexOf("?") + 1);
		view.query('empresa', Empresa.model.find().where('controlData', controlData ).populate('responsavelLegal', 'usuario'));




    view.render('empresa');
}
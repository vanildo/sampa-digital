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
    locals.formData = req.body;


    // Load dados empresa
    view.on('init', function (next) {
		id = url.substr(url.indexOf("?") + 1);
		
		locals.empresa = Empresa.model.findOne().populate('responsavelLegal', 'usuario').where('id', id);
		next();
	});


    view.render('empresa');
}
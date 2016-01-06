var keystone = require('keystone');
var Empresa = keystone.list('Empresa');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'aprovacao';

	view.query('pendencias', Empresa.model.find().populate('responsavelLegal').sort('razaoSocial').where('empresaSituacaoSistema', 'pendente'));

	view.render('aprovacao');

}

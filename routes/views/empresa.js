var keystone = require('keystone');
var async = require('async');
var Empresa = keystone.list('Empresa');
var Pessoa = keystone.list('Pessoa');
var CNAE = keystone.list('CNAE');
var Oportunidade = keystone.list('Oportunidade');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'cadastro';
    locals.cnaes = [];
    locals.oportunidades = [];
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.empresaSubmitted = false;

    locals.filters = {
        pessoa: req.params.pessoa
    };

    // Load Oportunidades
    view.on('init', function (next) {

        var q = Oportunidade.model.find().sort('sortOrder');

        q.exec(function (err, results) {
            locals.oportunidades = results;
            next(err);
        });
    });

    // Load CNAE
    view.on('init', function (next) {

        var q = CNAE.model.find().sort('sortOrder');

        q.exec(function (err, results) {
            locals.cnaes = results;
            next(err);
        });
    });

    view.on('post', {action: 'cadastroEmpresa'}, function (next) {

        var empresa = new Empresa.model({
            responsavelLegal: locals.filters.pessoa.id,
            empresaCadastroType: 'pendente',
        });

        var updater = empresa.getUpdateHandler(req);

        updater.process(req.body, {
            flashErrors: true
        }, function (err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                locals.empresaSubmitted = true;
            }
            next();
        });

    });

    view.render('empresa');

}

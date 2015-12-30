var keystone = require('keystone');
var async = require('async');
var Pessoa = keystone.list('Pessoa');


exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.section = 'cadastro';
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.pessoaSubmitted = false;


    view.on('post', {action: 'cadastro'}, function (next) {        

        var application = new Pessoa.model();
        var updater = application.getUpdateHandler(req);

        updater.process(req.body, {
            flashErrors: true
        }, function (err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                locals.pessoaSubmitted = true;
                locals.pessoa = application;
                return res.redirect('/empresa/' + application.id);
            }
            next();
        });

    });

    view.render('pessoa');

}

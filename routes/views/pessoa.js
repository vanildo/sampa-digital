var keystone = require('keystone');
var async = require('async');
var Pessoa = keystone.list('Pessoa');


exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'cadastro';
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.cpfCheck = true;
    locals.cpf = Pessoa;
    locals.cpfNumero;


    // Load the current category filter
    view.on('post', {action: 'isCpf'}, function (next) {
        if (req.body.cpf) {
            Pessoa.model.findOne({'cpf': req.body.cpf}).exec(function (err, result) {
                if (result) {
                    locals.cpf = result;
                    console.log(locals.cpf.id);
                    return res.redirect('/empresa/' + locals.cpf.id);
                } else
                {
                    locals.cpfCheck = false;
                }
                next(err);
            });
        } else {
            next();
        }
        locals.cpf = req.body.cpf;
        console.log(req.body.cpf);
        console.log(locals.cpf.id);

    });


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

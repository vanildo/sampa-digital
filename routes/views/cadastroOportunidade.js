var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var CNAE = keystone.list('CNAE');
var Oportunidade = keystone.list('Oportunidade');
var Usuario = keystone.list('Usuario');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var EmailConfig = keystone.list('EmailConfig');
var Pessoa = keystone.list('Pessoa');
var EmailsAdeSampa = keystone.list('EmailsAdeSampa');
exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'cadastroOportunidade';
//    locals.cnaes = [];
//    locals.oportunidades = [];
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.oportunidadeSubmitted = false;
    locals.compra = false;
    locals.venda = false;

    // Cadastro Empresa e Usuario
    view.on('post', {action: 'cadastroOportunidade'}, function (next) {

        var empresa = Empresa.model.findOne().where('usuario', locals.user.id);
        empresa.exec(function (err, resultE) {
            var oportunidade = new Oportunidade.model({
                empresa: resultE.id,
            });
            var updaterO = oportunidade.getUpdateHandler(req);
            updaterO.process(req.body, {
                flashErrors: true
            }, function (err) {
                if (err) {
                    locals.validationErrors = err.errors;
                } else {
                    console.log("Oportunidade: " + req.body.nome);
                    locals.oportunidadeSubmitted = true;
                }
                next();
            });
        });
    });

    //Cadastro de compra
    view.on('post', {action: 'compra'}, function (next) {
        locals.compra = true;
        next();
    });

    //Cadastro de venda
    view.on('post', {action: 'venda'}, function (next) {
        locals.venda = true;
        next();
    });

    view.render('cadastroOportunidade');
}
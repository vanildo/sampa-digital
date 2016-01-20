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
    locals.section = 'conta';
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.empresaTypes = Empresa.fields.empresaType.ops;
    // Load empresa
    view.on('init', function (next) {

        var empresa = Empresa.model.findOne().populate('responsavelLegal', 'usuario').where('usuario', locals.user.id);
        empresa.exec(function (err, resultE) {
            locals.empresaf = resultE;
            Pessoa.model.findById(resultE.responsavelLegal, function (err, resultP) {
                locals.pessoaf = resultP;
                Usuario.model.findById(resultE.usuario, function (err, resultU) {
                    locals.usuariof = resultU;
                    next(err);
                });
            });
        });
    });
    
    // Cadastro Empresa e Usuario
    view.on('post', {action: 'update'}, function (next) {

        var empresa = null;
        var usuario = null;
        var pessoa = null;

        function one(callback) {
            Empresa.model.findById(req.body.id, function (err, resultE) {
                empresa = resultE;
                Pessoa.model.findById(resultE.responsavelLegal, function (err, resultP) {
                    pessoa = resultP;
                    Usuario.model.findById(resultE.usuario, function (err, resultU) {
                        usuario = resultU;
                        callback();
                    });
                });
            });
        }

        function two() {
            empresa.nomeFantasia = req.body.nomeFantasia;
            empresa.descricao = req.body.descricao;
            empresa.contatoComercial = req.body.contatoComercial;
            empresa.telefone = req.body.telefone;
            empresa.endereco.street1 = req.body.endereco.street1;
            empresa.endereco.number = req.body.endereco.number;
            empresa.endereco.postcode = req.body.endereco.postcode;            
            empresa.endereco.suburb = req.body.endereco.suburb;            
            empresa.endereco.state = req.body.endereco.state;            
            empresa.endereco.street2 = req.body.endereco.street2;            
            empresa.endereco.name = req.body.endereco.name;
            empresa.logo = req.body.logo;            
            empresa.twitter = req.body.twitter;            
            empresa.facebook = req.body.facebook;
            empresa.webSite = req.body.webSite; 
            pessoa.nome = req.body.nome;
            pessoa.cpf = req.body.cpf;
            usuario.email = req.body.email;
            usuario.password = req.body.password;     
            usuario.save();
            pessoa.save();
            empresa.save();
            console.log("empresa atualizada: " + empresa.id);
            return res.redirect('/');
        }

        one(two);
    });
    view.render('conta');
}
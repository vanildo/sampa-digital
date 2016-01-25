var keystone = require('keystone');
//var $ = require('jQuery');
var Empresa = keystone.list('Empresa');
var Usuario = keystone.list('Usuario');
var Pessoa = keystone.list('Pessoa');



exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'conta';
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.empresaTypes = Empresa.fields.empresaType.ops;
    locals.updateSubmmited = false;
    locals.googlekey = keystone.get('google api key');

    // Load dados empresa
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
                Pessoa.model.findById(empresa.responsavelLegal, function (err, resultP) {
                    pessoa = resultP;
                    Usuario.model.findById(resultE.usuario, function (err, resultU) {
                        usuario = resultU;
                        callback();
                    });
                });
            });
        }

        function two() {
            {
                var updaterE = empresa.getUpdateHandler(req);
                updaterE.process(req.body, {
                    flashErrors: true
                }, function (err) {
                    if (err) {
                        locals.validationErrors = err.errors;
                    }
//                    var jsonLtdLng = "https://maps.googleapis.com/maps/api/geocode/json?address=Winnetka&bounds=34.172684,-118.604794|34.236144,-118.500938&key=AIzaSyBeLlSc4xte31Wttx8CxFLFuVl5Ob1FOlU";
//                    $.getJSON(jsonLtdLng, function (data) {
//                        console.log(data.results[0].geometry.location.lat);
//                    });
//                    console.log(jsonLtdLng);
                    console.log(req.body.latitude);
                    pessoa.nome = req.body.nome;
                    pessoa.cpf = req.body.cpf;
                    usuario.email = req.body.email;
                    empresa.endereco.geo = [req.body.longitude, req.body.latitude];

                    empresa.save();
                    usuario.save();
                    pessoa.save();
                    locals.updateSubmmited = true;
                    return res.redirect('/conta');
                });
                console.log("empresa atualizada: " + empresa.id);
            }
        }
        one(two);
    });
    view.render('conta');
}
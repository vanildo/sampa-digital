var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var Usuario = keystone.list('Usuario');
var Oportunidade = keystone.list('Oportunidade');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'manutencaoOportunidade';
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.oportunidadeSubmmited = false;
    locals.filters = {
        oportunidade: req.params.oportunidade
    };

    // Load dados oportunidade
    view.on('init', function (next) {
        var oportunidade = null;
        Oportunidade.model.findById(locals.filters.oportunidade, function (err, oportunidadef) {
            oportunidade = oportunidadef;
            locals.oportunidade = oportunidadef;
            next();
        });
    });

    // Cadastro Empresa e Usuario
    view.on('post', {action: 'update'}, function (next) {
        var oportunidade = null;
        function one(callback) {
            Oportunidade.model.findById(req.body.id, function (err, resultO) {
                oportunidade = resultO;
                callback();
            });
        }
        function two() {
            var updaterO = oportunidade.getUpdateHandler(req);
            updaterO.process(req.body, {
                flashErrors: true
            }, function (err) {
                if (err) {
                    locals.validationErrors = err.errors;
                }
                locals.oportunidadeSubmmited = true;                
                return res.redirect('/minhasOportunidades');
            });
            console.log("oportunidade atualizada: " + oportunidade.id);
        }
        one(two);
    });
    view.render('manutencaoOportunidade');
}
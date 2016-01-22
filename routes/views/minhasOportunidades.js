var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var Usuario = keystone.list('Usuario');
var Oportunidade = keystone.list('Oportunidade');


exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.section = 'minhasOportunidades';
    locals.oportunidades;
    locals.empresa;

    // Load Oportunidades
    view.on('init', function (next) {
        var q = Empresa.model.findOne().where('usuario', locals.user.id);
        q.exec(function (err, results) {
            locals.empresa = results.id;
            var q2 = Oportunidade.model.find().where('empresa', results.id);
            q2.exec(function (err, results) {
                locals.oportunidades = results;
                next(err);
            });
        });
    });

    //view.query('oportunidades', Oportunidade.model.find().populate('empresa').where('empresa.usuario', locals.user.id));

    view.on('post', {action: 'manutencao'}, function (next) { 
        function one(callback) {
            locals.oportunidade = req.body.id;
            callback();
        }
        function two() {
            res.oportunidade = req.body.id;           
            return res.redirect('/manutencaoOportunidade/' + req.body.id);
        }
        one(two);
    });

    view.render('minhasOportunidades');
}

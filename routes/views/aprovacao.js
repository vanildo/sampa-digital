var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var Usuario = keystone.list('Usuario');
exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.section = 'aprovacao';


    view.query('pendencias', Empresa.model.find().populate('responsavelLegal').sort('razaoSocial').where('empresaSituacaoSistema', 'pendente'));

    view.on('post', {action: 'aprovacao'}, function (next) {
        if (req.body.empresaSituacaoSistema == 1) {
            if (req.body.id) {
                Empresa.model.findById(req.body.id, function (err, result) {
                    if (result) {
                        locals.usuario = result.usuario;
                        Usuario.model.findById(locals.usuario, function (err, usuariof) {
                            if (usuariof) {
                                usuariof.isAdmin = true;
                                usuariof.save();
                            }
                        });
                        result.empresaSituacaoSistema = 'aprovado';
                        result.save();
                    }
                });
            }
        } else if (req.body.empresaSituacaoSistema == 2) {
            if (req.body.id) {
                Empresa.model.findById(req.body.id, function (err, result) {
                    if (result) {
                        result.empresaSituacaoSistema = 'rejeitado';
                        result.save();
                    }
                });
            }
        }
        return res.redirect('/aprovacao');
    });

    view.render('aprovacao');
}

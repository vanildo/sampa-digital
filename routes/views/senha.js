var keystone = require('keystone');
//var $ = require('jQuery');
var Usuario = keystone.list('Usuario');



exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'senha';
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.updateSubmmited = false;

    // Load dados usuario
    view.on('init', function (next) {
        var usuario = Usuario.model.findOne().where('controlData', locals.user.controlData);
        usuario.exec(function (err, resultU) {
            locals.usuariof = resultU;
            next(err);
                
		});
    });

    // Change Password
    view.on('post', {action: 'update'}, function (next) {

        var usuario = null;
		
		 locals.usuariof._.password.compare(req.body.senha, function(err, isMatch) {
			if (!err && isMatch) {
					Usuario.model.findById(locals.usuariof.controlData, function (err, resultU) {
						usuario = resultU;
						usuario.password = req.body.nSenha;
						usuario.save();
						locals.updateSubmmited = true;
						return res.redirect('/senha');
					});
					locals.updateSubmmited = true;
					return res.redirect('/senha');
					console.log("Senha atualizada: " + usuario.id);
			}else {
				return res.redirect('/senha');
				console.log("The cake is a lie!")
			}
		});
	});
	
    view.render('senha');
}
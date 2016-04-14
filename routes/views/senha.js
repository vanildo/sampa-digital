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
		var senha = req.body.senha;
		var senhaNova = req.body.nSenha;
		var senhaNovaConfirm = req.body.nSenhaConfirma;
		locals.senhasDiferentes = false;	
		locals.igualAtual = false;
		locals.missingFields = false;
		
		//Validacoes dos Campos
		if(senha != "" || senhaNova != "" || senhaNovaConfirm != ""){
			if(senhaNova != senhaNovaConfirm){
				locals.senhasDiferentes = true;			
			};			
			if(senha == senhaNova){
				locals.igualAtual = true;
			};
		}else{
			locals.missingFields = true
			
		};	
		
		//New and Old passowrd cararission
		locals.usuariof._.password.compare(senha, function(err, result){
			if (err) {
				next(err);
			}
			if (result) {
				Usuario.model.findOne({'controlData': locals.usuariof.controlData}).exec(function (err, resultU) {
					if (resultU && !locals.igualAtual && !locals.missingFields && !locals.senhasDiferentes) {
							usuario = resultU;
							usuario.password = req.body.nSenha;
							usuario.save();
							locals.updateSubmmited = true;
							next();
					}else{
						next();
					}
				});
			}else {
				locals.updateSubmmited = false;
				locals.senhaCorreta = false;
				next();				
			};
			
		});			
	});
	
    view.render('senha');
}
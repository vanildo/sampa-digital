var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var Oportunidade = keystone.list('Oportunidade');
var async = require('async');
var env = require('../env');
var Cloudant = require('cloudant');
var nodemailer = require('nodemailer');
var EmailConfig = keystone.list('EmailConfig');
var EmailsAdeSampa = keystone.list('EmailsAdeSampa');

// Initialize Cloudant with settings from .env
var cloudant = Cloudant(env.getDbUrl());
var db = cloudant.use(env.db.database);

var query = async.queue(function (task, callback) {
    callback();
}, 2);

var index = async.queue(function (task, callback) {
    callback();
}, 2);

var db_query = {name:'query', type:'text', index:{}}
db.index(db_query, function(er, response) {
  if (er) {
    throw er;
  }
  console.log('Index creation result: %s', response.result);
});


exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
	var url = view.req.originalUrl;
	locals.tipo = url.substr(url.indexOf("?") + 1);
    locals.section = 'cadastroOportunidade';
    locals.tipoOfertas = Oportunidade.fields.tipoOferta.ops;
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.compra = false;
    locals.venda = false;
	var emailConfigs;
	var emailConfig = EmailConfig.model.findOne().where('isAtivo', true);
	//var empresa = Empresa.model.findOne().where('razaoSocial', "Empresa do Fabio");
	//console.log(Empresa);
	
	
// Cadastro Empresa e Usuario
    view.on('post', {action: 'cadastroOportunidade'}, function (next) {

        var empresa = Empresa.model.findOne().where('usuario', locals.user.id);
        empresa.exec(function (err, resultE) {
            var oportunidade = new Oportunidade.model({
                isAtivo: true,
                empresa: resultE.id,
            });
            var updaterO = oportunidade.getUpdateHandler(req);
            updaterO.process(req.body, {
                flashErrors: true
            }, function (err) {
                if (err) {
                    locals.validationErrors = err.errors;
                } else {
                    locals.oportunidadeSubmitted = true;
                    oportunidade.isAtivo = true;
					oportunidade.controlData = res.locals.user.controlData;
                    oportunidade.save();
					oportunidade._doc.email = res.locals.user.email;
					
					//Matching vars
					var Mtipo;
					if(locals.tipo == "compra"){
						Mtipo = "Venda";
					}else{
						Mtipo = "Compra";
					};					
					var str = oportunidade.descricaoDetalhada;
					function clearSTR(str){
						var wordMatch = [" a "," A "," o ", " O "," no ", " e ", " de ", " os ", " com ", " de "];    
						for(i=0; i<wordMatch.length; i++){
						   str = str.replace(wordMatch[i], " ");
						}

						return str;
					}					
					var Mkeywords = clearSTR(str);
					queryKey ={
						
						
					}
					var busca = {"$text": Mkeywords};
					//Fila salvar index
					index.push({name: oportunidade.nome}, function (err) {
						db.insert({oportunidade}, oportunidade.id, function(err, body, header) {
							if (err) {
								return console.log("Insert Error: "+ err.message);
							}
							console.log('Oportunidade Salva');
						});
					});				
					//Fila matching
					query.push({name: oportunidade.nome}, function (err) {
						db.find({selector: {"$and":[{"$text": Mkeywords}, {"$text": Mtipo},{"$text": oportunidade.tipoOferta} ]}}, function(er, match) {
							if (er) {
								throw er;
							}
							if(match.docs.length <= 0){
								console.log("Nenhum matching encontrado")
							}else{
								var empresa =[];
								var autorizacao = null;	
								for (i = 0; i < match.docs.length ; i++){									
									//console.log("Matching found: "+ match.docs[i].oportunidade)
									if(match.docs[i].oportunidade.email != res.locals.user.email && match.docs[i].oportunidade.isAtive == true){
										empresa = Empresa.model.findOne().where('controlData', match.docs[i].oportunidade.controlData)
										empresa.exec(function (err, resultado){
											console.log("resultado");
											if(resultado){
												autorizacao = resultado.autorizacao;
												var emailBody = '<b>' + '<p>Saudações,</p><br />' +
												'<p>Foi encontrada uma oportunidade que voce talvez tenha interesse: </p>'; // html body
												if(autorizacao == true){
													emailBody = emailBody+ '<p> Nome da Oportunidade: ' + oportunidade.nome +'</p><br />'+
													'<p>Acesse Aqui: <a href="http://localhost:3000/oportunidades/?='+oportunidade.id+'">http://localhost:3000/oportunidades/?='+oportunidade.id+'</a></p></b>' // html body										
													//EMAIL SENDER
													emailConfig.exec(function (err, results) {
														if (results) {
															emailConfigs = results;
															locals.email = emailConfigs;

														}
														var emailConfig = EmailConfig.model.findOne().where('isAtivo', true);
														var smtps = 'smtps://' + emailConfigs.user + ':' + emailConfigs.senha + '@smtp.gmail.com';
														var transporter = nodemailer.createTransport(smtps);
														var mailOptions = {
															from: emailConfigs.from, // sender address//
															subject: emailConfigs.subjectCadastro, // Subject line
															html: emailBody
														};
														EmailsAdeSampa.model.find({}, function (err, docs) {
															var emails = [];
															for (i = 0; i < docs.length; i++) {
																emails[i] = docs[i].email;
															}
															mailOptions.to = match.docs[i].oportunidade.email;
															{
																transporter.sendMail(mailOptions, function (error, info) {
																	if (error) {
																		//fila de email nao enviado
																		return console.log(error);
																	}
																	console.log('Message sent AdeSampa: ' + info.response);
																});
															}
														});
														
													});
												}
											}

										});
									}
								}
							}
						});
					});					
                }
                next();
            });
        });
    });

    //Cadastro de compra
	if(locals.tipo == "compra"){
        locals.compra = true;
	}
	else if (locals.tipo == "venda"){
		locals.venda = true;
	}


    view.render('cadastroOportunidade');
}
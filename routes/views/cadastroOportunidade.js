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
var username = "electrun"
var password = "OmnPr1me#";
var cloudant = Cloudant({account:username, password:password});
var db = cloudant.db.use("oportunidades");

var query = async.queue(function (task, callback) {
    console.log('Task %s started  ' + task.name);
    callback();
}, 2);

var index = async.queue(function (task, callback) {
    console.log('Task %s started ' + task.name);
    callback();
}, 2);


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
					//var reg = /$a\s|\sa\s|a$|$o\s|\so\s|o$|$e\s|\se\s|e$|de|$os\s|\sos\s|os$|$as\s|\sas\s|as$|$do\s|\sdo\s|do$|$no\s|\sno\s|nos$|$nos\s|\snos\s|noss$|$dos\s|\sdos\s|doss$|$pelo\s|\spelo\s|pelos$|$pelos\s|\spelos\s|peloss$|$da\s|\sda\s|das$|das|na|nas|pela|pelas|dum|duns|num|nuns|ante|até|após|com|de|desde|em|entre|para|per|perante|por|sem|sob|sobre|trás|compra|venda/gi;
					function clearSTR(str){
						var wordMatch = [" a "," A "," o ", " O "," no ", " e ", " de ", " os ", " com ", " de "];    
						for(i=0; i<wordMatch.length; i++){
						   str = str.replace(wordMatch[i], " ");
						}

						return str;
					} 
					
					var Mkeywords = clearSTR(str);
					console.log("Keyword is: "+ Mkeywords);

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
						db.find({selector: {"$and":[{"$text": Mkeywords}, {"$text": Mtipo},{"$text": oportunidade.tipoOferta} ]}}, function(er, result) {
							if (er) {
								throw er;
							}
							if(result.docs.length <= 0){
								console.log("Nenhum matching encontrado")
							}else{
								for (i = 0; i < result.docs.length ; i++){
									console.log("Matching found: "+ result.docs[i].oportunidade)
									/*if(result.docs[i].oportunidade.email != res.locals.user.email){
										var empresa = Empresa.model.findOne().where('id', result.docs[i].oportunidade.empresa);
										var autorizacao = null;
										empresa.exec(function (err, result) {
											if(result){
												autorizacao = result.autorizacao;
											}
										});
										var emailBody = '<b>' + '<p>Saudações</p><br />' +
										'<p> Foi encontrada uma oportunidade que voce talvez tenha interesse: </p>'; // html body
										if(result.docs[i].oportunidade.email != res.locals.user.email && autorizacao == true){
											emailBody = emailBody+ '<p>' + result.docs[i].oportunidade.nome +'</p><br />'+
											'<p><a href="/oportunidades/?='+result.docs[i].oportunidade._id+'">http://localhost:3000/oportunidades/?='+result.docs[i].oportunidade._id+'</a></p></b>' // html body										
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
														mailOptions.to = result.docs[i].oportunidade.email;
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
									}*/
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
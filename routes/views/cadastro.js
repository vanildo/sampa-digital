var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
// var CNAE = keystone.list('CNAE');
var Oportunidade = keystone.list('Oportunidade');
var Usuario = keystone.list('Usuario');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var EmailConfig = keystone.list('EmailConfig');
var Pessoa = keystone.list('Pessoa');
var EmailsAdeSampa = keystone.list('EmailsAdeSampa');

function randomValueBase64(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64') // convert to base64 format
        .slice(0, len) // return required number of characters
        .replace(/\+/g, '0') // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');
    if(cnpj == '') return false;
    if (cnpj.length != 14)
        return false;
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;

    return true;

}


	//Validate all fields in the cadastro form

function fieldValidator(value){

	var razaoSocial = true;
	var telefone = true;
	var cpf = true;
	var descricao = true;
	var email = true;
	var empresaType = true;
	var endereco = true;
	var enderecoNumber = true;
	var postcode = true;
	var state = true;
	var street1 = true;
	var street2 = true;
	var suburb = true;
	var result = {};

//Valida Nome Fatasia
	if(value.razaoSocial){
		if(value.razaoSocial.length == "") {razaoSocial = false; console.log("Nome Fantasia Failed")};
	}else{
		razaoSocial = false;
	};


// Valida Telefone
	if(value.telefone){
		value.telefone = value.telefone.replace(/\D+/g,'');
		if(value.telefone.length != 10 && value.telefone.length != 11 && value.telefone.length != "") {telefone = false; console.log("Telefone Failed")};
	};
// Valida CPF
	if(value.cpf){
		value.cpf = value.cpf.replace(/[^\d]+/g,'');
		if(value.cpf == '') {cpf = false; console.log("CPF Failed")}
		if (value.cpf.length != 11 ||
			value.cpf == "00000000000" ||
			value.cpf == "11111111111" ||
			value.cpf == "22222222222" ||
			value.cpf == "33333333333" ||
			value.cpf == "44444444444" ||
			value.cpf == "55555555555" ||
			value.cpf == "66666666666" ||
			value.cpf == "77777777777" ||
			value.cpf == "88888888888" ||
			value.cpf == "99999999999")
			{cpf = false; console.log("CPF Failed")}

		add = 0;
		for (i=0; i < 9; i ++){
			add += parseInt(value.cpf.charAt(i)) * (10 - i);
		};
			rev = 11 - (add % 11);
			if (rev == 10 || rev == 11){ rev = 0; };
			if (rev != parseInt(value.cpf.charAt(9))){ cpf = false; console.log("CPF Failed")};

		add = 0;
		for (i = 0; i < 10; i ++){
			add += parseInt(value.cpf.charAt(i)) * (11 - i);
		};
		rev = 11 - (add % 11);
		if (rev == 10 || rev == 11) { rev = 0;};
		if (rev != parseInt(value.cpf.charAt(10))){ cpf = false; console.log("CPF Failed")};
	}

//Valida CEP - Se contem apenas 8 numeros
	if(value["endereco.postcode"]){
		value["endereco.postcode"] = value["endereco.postcode"].replace(/\D+/g,'');
		if(value["endereco.postcode"].length != 8 || isNaN(value["endereco.postcode"])) {postcode = false;};
	}
//Valida numero de endereco - Se contem apenas numeros no campo
	if(value["endereco.number"]){
		if(isNaN(value["endereco.number"])){enderecoNumber = false; console.log("Endereco Failed")};
	}
//Valida email
	if(value.email){
		var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(!filter.test(value.email)){email = false; console.log("Email Failed")};
	}else{
		email = false;
	};

//Return results of the checks
	result = {
		'razaoSocial':razaoSocial,
		'telefone':telefone,
		'cpf':cpf,
		'postcode':postcode,
		"enderecoNumber":enderecoNumber,
		"email":email,
	};
	return result;


};


exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'cadastro';
    locals.oportunidades = [];
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.empresaSubmitted = false;
    locals.usuarioSubmitted = false;
    locals.pessoaSubmitted = false;
    locals.cadastroCnpj = true;
    locals.empresaExistente = false;
    locals.empresaTypes = Empresa.fields.empresaType.ops;
    locals.empresaType = null;
    locals.cnpj = null;
    locals.cadastroInstituicao = true;
    locals.googlekey = keystone.get('google api key');
	locals.emailBlock = false;
	locals.cnpjCheck = true;
	locals.tipoEmpresa = true;
	locals.results = '';

    // Load Oportunidades
    view.on('init', function(next) {

        var q = Oportunidade.model.find().sort('sortOrder');
        q.exec(function(err, results) {
            locals.oportunidades = results;
            next(err);
        });
    });

    // Load the current cnpj
    view.on('post', {action: 'isCnpj'}, function (next) {
		req.body.cnpj.replace(/[^\d]+/g,'');
        locals.cnpj = req.body.cnpj;
        locals.empresaType = req.body.empresaType;
		locals.cnpjCheck = validarCNPJ(req.body.cnpj);
		if(!locals.empresaType){
			locals.tipoEmpresa = false;
		}

		if(locals.tipoEmpresa && locals.cnpjCheck){
			Empresa.model.findOne({'cnpj': req.body.cnpj}).exec(function (err, result) {
				if (result) {
					locals.cadastroCnpj = true;
					locals.empresaExistente = true;
					next();
				} else {
					locals.cadastroCnpj = false;
					next();
				}
			});
		}else{next();}
	});
    // Cadastro Empresa e Usuario
    view.on('post', {action: 'cadastroEmpresa'}, function (next) {
		locals.results = fieldValidator(req.body);
        locals.cnpj = req.body.cnpj;
        locals.empresaType = req.body.empresaType;
        locals.cadastroCnpj = false;
        var pessoa = new Pessoa.model();
        var updaterP = pessoa.getUpdateHandler(req);
        var usuario = new Usuario.model({
            isAdmin: false,
            sampaAdmin: false,
            responsavel: false,
            password: randomValueBase64(8),
            controlData: pessoa.id,
        });
        var updaterU = usuario.getUpdateHandler(req);
        var empresa = new Empresa.model({
            responsavelLegal: pessoa.id,
            empresaSituacaoSistema: 'pendente',
            usuario: usuario,
            controlData: pessoa.id,
        });
        var updaterE = empresa.getUpdateHandler(req);
        var emailConfigs;
        var emailConfig = EmailConfig.model.findOne().where('isAtivo', true);
		if(locals.results.razaoSocial 
		  && locals.results.telefone 
		  && locals.results.cpf 
		  && locals.results.postcode 
		  && locals.results.enderecoNumber 
		  && locals.results.email ){
			///email validation
			var emailVali = Usuario.model.findOne().where('email', req.body.email);
			emailVali.exec(function (err, email) {
				if(email){
					locals.cadastroInstituicao = false;
					locals.cadastroCnpj = false;
					locals.emailBlock = true;
					next();

				}else{
					emailConfig.exec(function (err, results) {
						if (results) {
							emailConfigs = results;
							locals.email = emailConfigs;

						}
						updaterP.process(req.body, {
							flashErrors: true
						}, function (err) {
							if (err) {
								locals.validationErrors = err.errors;
							} else {
								console.log("Cadastrado cpf: " + req.body.cpf);
								locals.pessoaSubmitted = true;
								locals.cadastroResponsavel = true;
								locals.pessoa = pessoa;
							}
							if (locals.pessoaSubmitted)
							{
								updaterE.process(req.body, {
									flashErrors: true
								}, function (err) {
									if (err) {
										locals.validationErrors = err.errors;
									} else {
										locals.empresaSubmitted = true;
										locals.cadastroInstituicao = false;
										empresa.endereco.geo = [req.body.longitude, req.body.latitude];
										empresa.save();
										console.log("Cadastrado cnpj: " + req.body.cnpj);
									}
									if (locals.empresaSubmitted)
									{
										updaterU.process(req.body, {
											flashErrors: true
										}, function (err) {
											if (err) {
												locals.validationErrors = err.errors;
											} else {
												locals.usuarioSubmitted = true;
												locals.cadastroUsuario = true;
												console.log("Cadastrado email: " + req.body.email);
												if (locals.empresaSubmitted && locals.usuarioSubmitted && locals.pessoaSubmitted) {
													if (emailConfigs) {
														var smtps = 'smtps://' + emailConfigs.user + '%40adesampa.com.br:' + emailConfigs.senha + '@smtp.gmail.com';
														var transporter = nodemailer.createTransport(smtps);
														var mailOptions = {
															from: emailConfigs.from, // sender address//
															subject: emailConfigs.subjectCadastro, // Subject line
															html: '<b>' + '<p>' + emailConfigs.saudacao + '</p> <p>' + emailConfigs.corpoCadastro + req.body.cnpj + '</p><br /><p>' + 'Telefone: '+req.body.telefone +'</p><br />'+'<p>'+  'Email: '+req.body.email +'</p>'+'</b>' // html body
														};
														console.log(mailOptions.html);
														EmailsAdeSampa.model.find({}, function (err, docs) {
															var emails = [];
															for (i = 0; i < docs.length; i++) {
																emails[i] = docs[i].email;
															}
															mailOptions.to = emails;
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
													} else {
														//fila de email nao enviado
													}
												} else {
													//houve algum erro no cadastro
												}
											}
											next();
										});
									} else {
										next();
									}
								});
							} else {
								next();
							}
						});
					});
				}
			});
		} else {
			next();
		}
	});
    view.render('cadastro');
}


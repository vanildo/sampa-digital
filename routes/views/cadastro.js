var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var CNAE = keystone.list('CNAE');
var Oportunidade = keystone.list('Oportunidade');
var Usuario = keystone.list('Usuario');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var EmailConfig = keystone.list('EmailConfig');
var Pessoa = keystone.list('Pessoa');


function randomValueBase64(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
            .toString('base64')   // convert to base64 format
            .slice(0, len)        // return required number of characters
            .replace(/\+/g, '0')  // replace '+' with '0'
            .replace(/\//g, '0'); // replace '/' with '0'
}

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.section = 'cadastro';
    locals.cnaes = [];
    locals.oportunidades = [];
    locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.empresaSubmitted = false;
    locals.usuarioSubmitted = false;
    locals.pessoaSubmitted = false;
    locals.empresaTypes = Empresa.fields.empresaType.ops;
    locals.empresaType;
    locals.cnpj;
    locals.pessoa;
    locals.cadastroCnpj = true;
    locals.cadastroInstituicao = true;
    locals.cadastroUsuario = true;
    locals.cadstroCpf = true;
    locals.cadastroRepresentante = true;
    locals.cpf;
    locals.email;
    locals.filters = {
        pessoa: req.params.pessoa
    };


//    //Mail
//    var transporter = nodemailer.createTransport('smtps://ogataricardo2010%40gmail.com:wshwwfvgxohoxqhn@smtp.gmail.com');
//    var mailOptions = {
//        from: 'ogataricardo2010@gmail.com', // sender address
//        to: 'rogata@br.ibm.com', // list of receivers
//        subject: 'Hello ✔', // Subject line
//        text: 'Hello world 🐴', // plaintext body
//        html: '<b>Hello world 🐴</b>' // html body
//    };


    // Load Oportunidades
    view.on('init', function (next) {

        var q = Oportunidade.model.find().sort('sortOrder');
        q.exec(function (err, results) {
            locals.oportunidades = results;
            next(err);
        });
    });


    // Load CNAE
    view.on('init', function (next) {

        var q = CNAE.model.find().sort('sortOrder');
        q.exec(function (err, results) {
            locals.cnaes = results;
            next(err);
        });
    });

    // Load the current cnpj 
    view.on('post', {action: 'isCnpj'}, function (next) {
        locals.cnpj = req.body.cnpj;
        locals.empresaType = req.body.empresaType;
        if (req.body.cnpj) {
            Empresa.model.findOne({'cnpj': req.body.cnpj}).exec(function (err, result) {
                if (result) {
                    locals.cnpj = result;
                    return res.redirect('/cadastro');
                } else
                {
                    locals.cadastroCnpj = false;
                }
                next(err);
            });
        } else {
            next();
        }
    });

    // Cadastro Empresa e Usuario
    view.on('post', {action: 'cadastroEmpresa'}, function (next) {

        locals.cnpj = req.body.cnpj;
        locals.empresaType = req.body.empresaType;
        locals.cadastroCnpj = false;

        var pessoa = new Pessoa.model();        
        var updaterP = pessoa.getUpdateHandler(req);
        var usuario = new Usuario.model({
            isAdmin: false,
            sampaAdmin: false,
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

        emailConfig.exec(function (err,results) {
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
                                    if (locals.empresaSubmitted && locals.usuarioSubmitted && emailConfigs && locals.pessoaSubmitted) {
                                        var smtps = 'smtps://' + emailConfigs.user + '%40gmail.com:' + emailConfigs.senha + '@smtp.gmail.com';
                                        var transporter = nodemailer.createTransport(smtps);
                                        var mailOptions = {
                                            from: emailConfigs.from, // sender address
                                            to: 'ogata_ricardo@hotmail.com', // list of receivers
                                            subject: emailConfigs.subject, // Subject line
                                            text: emailConfigs.text1, // plaintext body                                   
                                            html: '<b>' + emailConfigs.text2 + '</b>' // html body
                                        };
                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error) {
                                                return console.log(error);
                                            }
                                            console.log('Message sent: ' + info.response);
                                        });
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
    });
    view.render('cadastro');
}
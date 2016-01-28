var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var Usuario = keystone.list('Usuario');
var nodemailer = require('nodemailer');
var EmailConfig = keystone.list('EmailConfig');
var crypto = require('crypto');

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
    locals.validationErrors = {};
    locals.section = 'aprovacao';

    view.query('pendencias', Empresa.model.find().populate('responsavelLegal').sort('razaoSocial').where('empresaSituacaoSistema', 'pendente'));

    view.on('post', {action: 'aprovacao'}, function (next) {

        var emailConfigs;
        var emailConfig = EmailConfig.model.findOne().where('isAtivo', true);
        var usuario = null;
        var empresa = null;
        var emailConfigs = null;
        var senha;

        function one(callback) {
            Empresa.model.findById(req.body.id, function (err, empresaf) {
                if (empresaf) {
                    empresa = empresaf;
                    locals.usuario = empresaf.usuario;
                    usuario = empresaf.usuario;
                    Usuario.model.findById(empresa.usuario, function (err, usuariof) {
                        if (usuariof) {
                            usuario = usuariof;
                            emailConfig.exec(function (err, emailf) {
                                if (emailf) {
                                    emailConfigs = emailf;
                                    callback();
                                }
                            });
                        }
                    });
                }
            }).populate('responsavelLegal');
        }

        function two() {
            if (usuario && empresa) {
                if (req.body.empresaSituacaoSistema == 1) {
                    empresa.empresaSituacaoSistema = 'aprovado';
                    empresa.save();
                    usuario.responsavel = true;
                    senha = randomValueBase64(8);
                    usuario.password = senha;
                    usuario.save();
                    console.log("Empresa salva: " + empresa.id);
                    if (emailConfigs) {
                        var smtps = 'smtps://' + emailConfigs.user + '%40adesampa.com.br:' + emailConfigs.senha + '@smtp.gmail.com';
                        var transporter = nodemailer.createTransport(smtps);
                        var mailOptions = {
                            from: emailConfigs.from, // sender address//                                             
                            to: usuario.email, // list of receivers
                            subject: emailConfigs.subjectAprovacao, // Subject line                                                     
                            html: '<b>' + '<p>' + emailConfigs.saudacao + ' ' + empresa.responsavelLegal.nome + '</p>'
                                    + '<p>' + emailConfigs.corpoAprovacao + '</p>'
                                    + '<p>' + 'Usuario: ' + ' ' + usuario.email
                                    + '<p>' + 'Senha: ' + ' ' + senha
                                    + '<p>' + 'Este é um e-mail automático, você não precisa responder' + '</p>' + '</b>' // html body
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                //fila de email nao enviado
                                return console.log(error);
                            }
                            console.log('Message sent: ' + info.response);
                        });
                    } else {
                        //fila de email nao enviado
                    }
                } else if (req.body.empresaSituacaoSistema == 2) {
                    empresa.empresaSituacaoSistema = 'rejeitado';
                    empresa.save();
                    console.log("Empresa rejeitada: " + empresa.id);
                    if (emailConfigs) {
                        var smtps = 'smtps://' + emailConfigs.user + '%40adesampa.com.br:' + emailConfigs.senha + '@smtp.gmail.com';
                        var transporter = nodemailer.createTransport(smtps);
                        var mailOptions = {
                            from: emailConfigs.from, // sender address//                                            
                            to: usuario.email, // list of receivers
                            subject: emailConfigs.subjectRejeicao, // Subject line                                                  
                            html: '<b>' + '<p>' + emailConfigs.saudacao + ' ' +
                                    empresa.responsavelLegal.nome + '</p>' + '<p>' + emailConfigs.corpoRejeicao +
                                    '</p>' + '</p>'
                                    + '<p>' + 'Este é um e-mail automático, você não precisa responder' + '</p>' + '</b>' // html body
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                //fila de email nao enviado
                                return console.log(error);
                            }
                            console.log('Message sent: ' + info.response);
                        });
                    } else {
                        //fila de email nao enviado
                    }
                }

                return res.redirect('/aprovacao');
            }
        }
        ;
        one(two);
    });

    view.render('aprovacao');
}

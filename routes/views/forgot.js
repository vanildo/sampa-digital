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
    locals.section = 'forgot';
    locals.usuarioSubmitted = false;

    view.on('post', {action: 'reset'}, function (next) {

        var emailConfigs;
        var emailConfig = EmailConfig.model.findOne().where('isAtivo', true);
        var usuario = null;
        var emailConfigs = null;
        var senha;

        function one(callback) {
            var empresa = Empresa.model.findOne().populate('usuario').where('cnpj', req.body.cnpj);
            empresa.exec(function (err, resultE) {
                locals.empresaf = resultE;
                if (resultE) {
                    if (resultE.usuario) {
                        Usuario.model.findById(resultE.usuario, function (err, resultU) {
                            usuario = resultU;
                            locals.usuariof = resultU;
                            if (resultU) {
                                if (resultU.email == req.body.email && resultE.cnpj == req.body.cnpj) {
                                    emailConfig.exec(function (err, emailf) {
                                        if (emailf) {
                                            emailConfigs = emailf;
                                            locals.usuarioSubmitted = true;
                                            callback();
                                        }
                                    });
                                } else {
                                    req.flash('error', 'Dados Inválidos.');
                                    return res.redirect('/forgot');
                                }
                                next(err);
                            } else {
                                req.flash('error', 'Dados Inválidos.');
                                return res.redirect('/forgot');
                            }
                        });
                    } else {
                        req.flash('error', 'Dados Inválidos.');
                        return res.redirect('/forgot');
                    }
                } else {
                    req.flash('error', 'Dados Inválidos.');
                    return res.redirect('/forgot');
                }
            });
        }
        ;


        function two() {
            senha = randomValueBase64(8);
            usuario.password = senha;
            usuario.save();
            locals.usuarioSubmitted = true;
            console.log("Reset de senha: " + usuario.email);
            if (emailConfigs) {
                var smtps = 'smtps://' + emailConfigs.user + '%40adesampa.com.br:' + emailConfigs.senha + '@smtp.gmail.com';
                var transporter = nodemailer.createTransport(smtps);
                var mailOptions = {
                    from: emailConfigs.from, // sender address//                                             
                    to: usuario.email, // list of receivers
                    subject: emailConfigs.subjectAprovacao, // Subject line                                                     
                    html: '<b>'
                            + '<p>' + '*NÃO RESPONDA A ESTE E-MAIL. ELE É GERADO AUTOMATICAMENTE.' + '</p>'
                            + '<p>' + emailConfigs.saudacao + '</p>'
                            + '<p>' + 'Reset de Senha efetuado com sucesso!' + '</p>'
                            + '<p>' + 'Usuário: ' + ' ' + usuario.email
                            + '<p>' + 'Senha: ' + ' ' + senha
                            + '</b>' // html body
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        //fila de email nao enviado
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                    locals.usuarioSubmitted = true;
                });
            } else {
                //fila de email nao enviado
            } 
        }

        ;
        one(two);        
    });

    view.render('forgot');
}

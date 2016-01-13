var keystone = require('keystone');
var Empresa = keystone.list('Empresa');
var CNAE = keystone.list('CNAE');
var Oportunidade = keystone.list('Oportunidade');
var Usuario = keystone.list('Usuario');
var crypto = require('crypto');
var nodemailer = require('nodemailer');


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
    locals.filters = {
        pessoa: req.params.pessoa
    };

    //Mail
    var transporter = nodemailer.createTransport('smtps://ogataricardo2010%40gmail.com:wshwwfvgxohoxqhn@smtp.gmail.com');
    var mailOptions = {
        from: 'ogataricardo2010@gmail.com', // sender address
        to: 'rogata@br.ibm.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world 🐴', // plaintext body
        html: '<b>Hello world 🐴</b>' // html body
    };


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

    view.on('post', {action: 'cadastroEmpresa'}, function (next) {


        //Cadastro de usuario
        var usuario = new Usuario.model({
            isAdmin: false,
            sampaAdmin: false,
            password: randomValueBase64(8),
            controlData: locals.filters.pessoa,
        });

        var updaterU = usuario.getUpdateHandler(req);
        updaterU.process(req.body, {
            flashErrors: true
        }, function (err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                locals.usuarioSubmitted = true;
                if (locals.empresaSubmitted && locals.usuarioSubmitted) {
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    });
                }
                console.log(locals.empresaSubmitted + " - empresa - " + locals.usuarioSubmitted);
            }
        });

        var empresa = new Empresa.model({
            responsavelLegal: locals.filters.pessoa,
            empresaSituacaoSistema: 'pendente',
            usuario: usuario,
            controlData: locals.filters.pessoa,
        });

        var updaterE = empresa.getUpdateHandler(req);
        updaterE.process(req.body, {
            flashErrors: true
        }, function (err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                locals.empresaSubmitted = true;            
            }
            next();
        });

    });


    view.render('empresa');
}
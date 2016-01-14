var keystone = require('keystone');
var nodemailer = require('nodemailer');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.section = 'mail';


//    view.query('pendencias', Empresa.model.find().populate('responsavelLegal').sort('razaoSocial').where('empresaSituacaoSistema', 'pendente'));

    view.on('post', {action: 'mail'}, function (next) {



// create reusable transporter object using the default SMTP transport
//        var transporter = nodemailer.createTransport('smtps://ogataricardo2010%40gmail.com:wshwwfvgxohoxqhn@smtp.gmail.com');
        var transporter = nodemailer.createTransport('smtps://parceriaibm%40gmail.com:ibmadesampa@smtp.gmail.com');

// setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'parceriaibm@adesampa.com.br', // sender address
//            from: 'ogataricardo2010@gmail.com', // sender address
            to: 'rogata@br.ibm.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world 🐴', // plaintext body
            html: '<b>Hello world 🐴</b>' // html body
        };

// send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

        return res.redirect('/mail');
    });

    view.render('mail');
}

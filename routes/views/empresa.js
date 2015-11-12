var keystone = require('keystone');
var Empresa = keystone.list('Empresa');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    


    // Set locals
    locals.section = 'empresa';
    locals.validationErrors = {};
    locals.empresaSubmitted = false;
    locals.nomes = [];   
    
    view.query('empresas', Empresa.model.find().sort('nomeFantasia'));
    
    // On POST requests, add the Empresa item to the database
    view.on('post', {action: 'empresa'}, function (next) {

        var newEmpresa = new Empresa.model(),
                updater = newEmpresa.getUpdateHandler(req);

        updater.process(req.body, {
            flashErrors: true,
            fields: 'nomeFantasia , razaoSocial',
            errorMessage: 'There was a problem submitting your Empresa:'
        }, function (err) {
            if (err) {
                locals.validationErrors = err.errors;
            } else {
                locals.empresaSubmitted = true;
            }
            next();
        });

    });


    // Render the view
    view.render('empresa');

};

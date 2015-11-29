var keystone = require('keystone');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Set locals
    locals.section = 'empresa';

    // Load the galleries by sortOrder
    view.query('empresas', keystone.list('Empresa').model.find().sort('sortOrder'));

    // Render the view
    view.render('empresa');

};

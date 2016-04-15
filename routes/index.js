/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function (app) {

    // Views
    app.get('/', routes.views.index);
    app.get('/blog/:category?', routes.views.blog);
    app.get('/blog/post/:post', routes.views.post);
    app.get('/agenda/', routes.views.agenda);
    app.get('/gallery', routes.views.gallery);
    app.get('/painel', routes.views.painel);
    app.get('/q4qrsd5khd11bw', routes.views.error);
    app.get('/bluemix', routes.views.bluemix);
    app.all('/contact', routes.views.contact);
    app.all('/oportunidades', routes.views.oportunidade);
    app.all('/termos', routes.views.termos);
    app.all('/aprovacao', middleware.requireAdmin, routes.views.aprovacao);
    app.all('/cadastro', routes.views.cadastro);
    app.all('/conta', routes.views.conta);
    app.all('/cadastroOportunidade', routes.views.cadastroOportunidade);
    app.all('/minhasOportunidades', routes.views.minhasOportunidades);
    app.all('/manutencaoOportunidade/:oportunidade', routes.views.manutencaoOportunidade);
    app.all('/forgot', routes.views.forgot);
	app.all('/senha', routes.views.senha);
	app.all('/empresa', routes.views.empresa);
	app.all('/faq', routes.views.faq);




    // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
    // app.get('/protected', middleware.requireUser, routes.views.protected);

};

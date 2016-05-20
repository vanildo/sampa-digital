// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();
// Require keystone
var keystone = require('keystone');

//database
var mongoUri;
// var mongoURI = "mongodb://IbmCloud_66msqd73_rc5oqcc5_185k3qgu:MFZUjy0hWwgc_PMPBkpQma4ZU1hnkHeV@ds041053.mongolab.com:41053/IbmCloud_66msqd73_rc5oqcc5";

if (process.env.mongoDB) {
    mongoUri = process.env.mongoDB;
} else {
    mongoUri = "mongodb://localhost/keystone";
}



// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
    'name': 'Sampa Digital',
    'brand': 'Sampa Digital',
    'less': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': 'jade',
    'mongo': mongoUri,
    'emails': 'templates/emails',
    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'Usuario',
    'cookie secret': process.env.COOKIE_SECRET || 'demo',
    'ga property': 'UA-73901933-1',
    'ga domain': 'auto',
    'chartbeat property': process.env.CHARTBEAT_PROPERTY,
    'chartbeat domain': process.env.CHARTBEAT_DOMAIN

});

// Load your project's Models

keystone.import('models');

// keystone.set('mongo', mongoURI);
// keystone.set('host', appEnv.bind);
// keystone.set('port',appEnv.port);

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
    _: require('underscore'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
    ga_property: keystone.get('ga property'),
    ga_domain: keystone.get('ga domain'),
    chartbeat_property: keystone.get('chartbeat property'),
    chartbeat_domain: keystone.get('chartbeat domain')
});

// Load your project's Routes

keystone.set('routes', require('./routes'));


// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
    logo_src: '/images/logo-email.gif',
    logo_width: 194,
    logo_height: 76,
    theme: {
        email_bg: '#f9f9f9',
        link_color: '#2697de',
        buttons: {
            color: '#fff',
            background_color: '#2697de',
            border_color: '#1a7cb7'
        }
    }
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
        find: '/images/',
        replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
    }, {
        find: '/keystone/',
        replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
    }]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
                'Empresa': 'empresas',
                'Oportunidades': 'oportunidades',
                'Contas': ['usuarios', 'pessoas'],
                'Noticias': ['posts', 'post-comments', 'post-categories'],
                'Agenda': 'eventos',
                'Galerias': 'galleries',
                'Messagem': 'enquiries',
                'CNAE': 'CNAE',
                'EmailConfig': 'EmailConfig',
                'EmailsAdeSampa': 'EmailsAdeSampa',
});

keystone.set('email nodemailer', {
    // Nodemailer configuration
});

keystone.set('google api key', 'AIzaSyD4AXhCYbyqXp-4zPiPQR3O2U58qZatvW4');
keystone.set('google server api key', 'AIzaSyChidbLI_Qg-Ni_PhJcykdkPD-BVxOGTo0');

// Start Keystone to connect to your database and initialise the web server

keystone.start();

var keystone = require('keystone');
var Cloudant = require('cloudant');


exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
	
    // locals.section is used to set the currently selected
    // item in the header navigation.
    //locals.section = 'home';

    // Render the view
    view.render('test');

};

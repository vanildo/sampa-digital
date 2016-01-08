var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Noticia Model
 * =============
 */

var Noticia = new keystone.List('Noticia', {
    map: {name: 'noticia'},
    track: { createdBy: true, updatedBy: true},
    autokey: {path: 'noticia', from: 'noticia'}
});

Noticia.add({
    noticia: {type: String, label: 'Notícia'}, 
    images: { type: Types.CloudinaryImages }
});

/**
 * Relationships
 */



/**
 * Registration
 */

Noticia.defaultColumns = 'noticia';

//Noticia.register();

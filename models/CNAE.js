var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * CNAE Model
 * =============
 */

var CNAE = new keystone.List('CNAE', {
    map: {name: 'codigo'},
    track: true,
    autokey: {path: 'codigo', from: 'codigo'}
});
CNAE.add({
    codigo: {type: String, required: true},
    descricao: {type: String}  
});
/**
 * Relationships
 */


/**
 * Registration
 */
CNAE.defaultColumns = 'codigo , descricao';
CNAE.register();

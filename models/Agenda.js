var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Agenda Model
 * =============
 */

var Agenda = new keystone.List('Agenda', {
    map: {name: 'titulo'},
    track: true,
    autokey: {path: 'titulo', from: 'titulo'},
	label:'Eventos',
});
Agenda.add({
    titulo: {type: String, required: true, initial: true, note: 'This field is required.'},
    texto: {
        breve: {type: Types.Html, wysiwyg: true, height: 150},
        longo: {type: Types.Html, wysiwyg: true, height: 400}
    },
    dataInicio: { type: Types.Date },
    dataFim: { type: Types.Date },
    imagem: {type: String}    
});
/**
 * Relationships
 */


/**
 * Registration
 */
Agenda.defaultColumns = 'titulo , dataInicio, dataFim';
Agenda.defaultSort = '-createdAt';
Agenda.register();

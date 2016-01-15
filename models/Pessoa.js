var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Pessoa Model
 * =============
 */

var Pessoa = new keystone.List('Pessoa', {
    map: {name: 'nome'},
    track: true,
    autokey: {path: 'nomeID', from: 'nome'},
    label: 'Responsavel',
    nocreate: true,
});
Pessoa.add({
    nome: {type: String, initial: true},   
    cpf: {type: String, required: true, initial: true}
});
/**
 * Relationships
 */


/**
 * Registration
 */
Pessoa.defaultColumns = 'nome,cpf';
Pessoa.register();

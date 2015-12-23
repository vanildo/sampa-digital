var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Pessoa Model
 * =============
 */

var Pessoa = new keystone.List('Pessoa', {
    map: {name: 'nome'},
    track: true,
    autokey: {path: 'nome', from: 'nome'}
});
Pessoa.add({
    nome: {type: String, required: true},
    endereco: {type: Types.Location},
    rg: {type: String, unique: true, required: true, initial: true, label: 'RG'},
    cpf: {type: String, unique: true, required: true, initial: true, label: 'CPF'}
});
/**
 * Relationships
 */


/**
 * Registration
 */
Pessoa.defaultColumns = 'nome';
Pessoa.register();

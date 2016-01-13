var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Pessoa Model
 * =============
 */

var Pessoa = new keystone.List('Pessoa', {
    map: {name: 'nome'},
    track: true,
    autokey: {path: 'nome', from: 'nome'},
    label: 'Responsavel',
    nocreate: true,
});
Pessoa.add({
    nome: {type: String, required: true, initial: true},
    cep: {type: String, required: true, initial: true},
    bairro: {type: String, required: true, initial: true},
    cidade: {type: String, required: true, initial: true},
    estado: {type: String, required: true, initial: true},
    endereco: {type: String, required: true, initial: true},
    enderecoNumero: {type: String, required: true, initial: true},
    latitude: {type: String},
    longitude: {type: String},
    cpf: {type: String, unique: true, required: true, initial: true}
});
/**
 * Relationships
 */


/**
 * Registration
 */
Pessoa.defaultColumns = 'nome,cpf';
Pessoa.register();

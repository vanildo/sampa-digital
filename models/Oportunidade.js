var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Oportunidade Model
 * =============
 */

var Oportunidade = new keystone.List('Oportunidade', {
    map: {name: 'nome'},
    track: true,
    autokey: {path: 'nome', from: 'nome'}
});
Oportunidade.add({
    nome: {type: String, inital: true, required: true},
    descricao: {type: String},
    tipoOportunidade: {type: Types.Select, options: ['COMPRA', 'VENDA']},
    quantidade: {type: Types.Number},
    preco: {type: Types.Money},
});
/**
 * Relationships
 */


/**
 * Registration
 */
Oportunidade.defaultColumns = 'descricao, tipoOportunidade, quantidade , preco';
Oportunidade.register();

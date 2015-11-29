var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Oportunidade Model
 * =============
 */

var Oportunidade = new keystone.List('Oportunidade', {
    map: {name: 'descricao'},
    track: true,
    autokey: {path: 'descricao', from: 'descricao'}
});
Oportunidade.add({
    tipoOportunidade: {type: Types.Select, options: ['COMPRA', 'VENDA']},
    descricao: {type: String, required: true},
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

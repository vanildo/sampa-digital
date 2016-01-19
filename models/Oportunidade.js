var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Oportunidade Model
 * =============
 */

var Oportunidade = new keystone.List('Oportunidade', {
    map: {name: 'nome'},
    track: true,
    autokey: {path: 'key', from: 'nome'}
});
Oportunidade.add({
    nome: {type: String, initial: true, required: true},
    descricao: {type: String},
	descCurta: {type: String, initial: true, required:true},
    tipoOportunidade: {type: Types.Select, options: ['COMPRA', 'VENDA'], initial: true, required:true},
    quantidade: {type: Types.Number, initial: true, required:true},
    preco: {type: Types.Money, initial: true, required:true},
});
/**
 * Relationships
 */


/**
 * Registration
 */
Oportunidade.defaultColumns = 'descricao, descCurta, tipoOportunidade, quantidade , preco';
Oportunidade.register();

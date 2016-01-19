var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Oportunidade Model
 * =============
 */

var Oportunidade = new keystone.List('Oportunidade', {
    map: {name: 'Nome'},
	track: true,
	autokey: {path: 'key', from: 'Nome'}
});
Oportunidade.add({
    Nome: {type: String, initial: true, required: true},
	descricaoBrief: {type: String, initial: true, required: true, label:"Descricao Resumida: "},
    tipoOportunidade: {type: Types.Select, options: ['COMPRA', 'VENDA'], label: "Tipo de Oportunidade", initial: true, required:true},
    Quantidade: {type: Types.Number, initial: true, required:true},
    Preco: {type: Types.Money, initial: true, required:true},
	descricaoBrief: {type: String, initial: true, required: true},
});
/**
 * Relationships
 */


/**
 * Registration
 */
Oportunidade.defaultColumns = 'Nome, tipoOportunidade, Quantidade , Preco';
Oportunidade.register();

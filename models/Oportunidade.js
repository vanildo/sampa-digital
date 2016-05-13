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
	controlData:{type: String, hidden: true, noedit: true},
    nome: {type: String, initial: true, required: true},
    breveDescricao: {type: String, initial: true, required: true, label: "Descrição Resumida: "},
    tipoOportunidade: {type: Types.Select, options: ['COMPRA', 'VENDA'], label: "Tipo de Oportunidade", initial: true, required: true},
    quantidade: {type: String},
    preco: {type: Types.Money, currency: 'pt-br', format: '$0,0.00'},
    descricaoDetalhada: {type: Types.Textarea, required: true, initial: true},
    empresa: {type: Types.Relationship, ref: 'Empresa', index: true},
    isAtivo: {type: Types.Boolean},
    categoria: {type: String},
    subCategoria: {type: String},
    orcamento: {type: String},
    nivelExperiencia: {type: String},
    visibilidade: {type: String},
    linkProposta: {type: String},
    imagem: {type: String},
    tipoOferta: {type: Types.Select, options: [
            {value: 'produto', label: "Produto"},
            {value: 'servico', label: "Serviço"},
        ], required: true, label: "Tipo de Oferta", initial: true},
});
/**
 * Relationships
 */

Oportunidade.relationship({ref: 'Empresa', refPath: 'oportunidades'});


/**
 * Registration
 */
Oportunidade.defaultColumns = 'nome, tipoOportunidade, quantidade , preco';

Oportunidade.register();

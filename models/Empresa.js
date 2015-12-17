var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Empresa Model
 * =============
 */

var Empresa = new keystone.List('Empresa', {
    map: {name: 'razaoSocial'},
    track: true,
    autokey: {path: 'razaoSocial', from: 'razaoSocial', unique: true}
});

Empresa.add({
    nomeFantasia: {type: String, label: 'Nome Fantasia'},
    razaoSocial: {type: String, label: 'Razão Social'},
    descricao: {type: String},
    responsavelLegal: {type: Types.Relationship, ref: 'Pessoa'},
    contato: {type: String},
    contatoComercial: {type: String},
    telefone: {type: String},
    endereco: {type: Types.Location},
    cnpj: {type: String, unique: true, required: true, initial: true, label: 'CNPJ'},
    cnae: {type: Types.Relationship, ref: 'CNAE'},
    logo: {type: Types.CloudinaryImage},
    twitter: {type: String},
    facebook: {type: String},
    linkedin: {type: String},
    webSite: {type: String},
    oportunidades: {type: Types.Relationship, ref: 'Oportunidade', many: true}
});

/**
 * Relationships
 */

Empresa.relationship({ref: 'Oportunidade', path: 'oportunidades', refPath: 'oportunidade'});
Empresa.relationship({ref: 'CNAE', path: 'codigos', refPath: 'codigo'});
Empresa.relationship({ref: 'Pessoa', path: 'nomes', refPath: 'nome'});


/**
 * Registration
 */

Empresa.defaultColumns = 'razaoSocial, cnpj';

Empresa.register();

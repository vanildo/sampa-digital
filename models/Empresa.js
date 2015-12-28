var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Empresa Model
 * =============
 */

var Empresa = new keystone.List('Empresa', {
    nocreate: true
});

Empresa.add({
    nomeFantasia: {type: String, required: true},
    razaoSocial: {type: String, required: true},
    descricao: {type: String},
    responsavelLegal: {type: Types.Relationship, ref: 'Pessoa'},
    contato: {type: String},
    contatoComercial: {type: String},
    telefone: {type: String},
    endereco: {type: Types.Location},
    cnpj: {type: String, unique: true, required: true, initial: true},
    cnae: {type: Types.Relationship, ref: 'CNAE'},
    logo: { type: Types.Url },
    twitter: {type: String},
    facebook: {type: String},
    linkedin: {type: String},
    webSite: {type: String},
    oportunidades: {type: Types.Relationship, ref: 'Oportunidade', many: true},
    empresaCadastroType: {type: Types.Select, options: [
            {value: 'aprovado', label: "Aprovado"},
            {value: 'rejeitado', label: "Rejeitado"},
            {value: 'pendente', label: "Aguardando aprovação"},
        ], required: true}
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

Empresa.defaultColumns = 'razaoSocial, cnpj, empresaCadastroType';
Empresa.defaultSort = '-createdAt';
Empresa.register();

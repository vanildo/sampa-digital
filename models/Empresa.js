var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Empresa Model
 * =============
 */

var Empresa = new keystone.List('Empresa', {
    map: {name: 'razaoSocial'},
    nocreate: true,
});

Empresa.add({
    controlData: {type: String, hidden: true, noedit: true},
    nomeFantasia: {type: String, index: true, label: "Razão Social"},
    razaoSocial: {type: String, unique: true, required: true, initial: true, index: true},
    descricao: {type: String, index: true, initial: true},
    responsavelLegal: {type: Types.Relationship, ref: 'Pessoa', label: "Responsável Legal"},
    contatoComercial: {type: String, initial: true},
    telefone: {type: String, label: "Telefone de contato", initial: true},
    endereco: {type: Types.Location},
    cnpj: {type: String, unique: true, required: true, initial: true, label: "CNPJ"},
    cnae: {type: Types.Relationship, ref: 'CNAE', many: true},
    logo: {type: Types.Url},
    twitter: {type: String},
    facebook: {type: String},
    webSite: {type: String},
    usuario: {type: Types.Relationship, ref: 'Usuario'},
	NotifAutorization: {type: Types.Boolean, default: true},
    empresaType: {type: Types.Select, options: [
            {value: 'empresa', label: "Empresa"},
            {value: 'instituicao', label: "Instituição"},
            {value: 'startup', label: "Start-up"},
            {value: 'workplace', label: "Workplace"},
            {value: 'incubadora', label: "Incubadora"},
            {value: 'universidade', label: "Universidade"},
        ], required: true}
}
, 'Situação da Empresa no Sistema', {
    empresaSituacaoSistema: {type: Types.Select, options: [
            {value: 'aprovado', label: "Aprovado"},
            {value: 'rejeitado', label: "Rejeitado"},
            {value: 'pendente', label: "Aguardando aprovação"},
        ], required: true, label: 'Status'},
});

/**
 * Relationships
 */

Empresa.relationship({ref: 'Oportunidade', path: 'oportunidades', refPath: 'empresa'});
Empresa.relationship({ref: 'CNAE', path: 'codigos', refPath: 'codigo'});
Empresa.relationship({ref: 'Pessoa', path: 'nomes', refPath: 'nome'});
Empresa.relationship({ref: 'Usuario', path: 'usuarios', refPath: 'usuario'});

/**
 * Registration
 */

Empresa.defaultColumns = 'razaoSocial, cnpj, empresaSituacaoSistema';
Empresa.defaultSort = '-createdAt';
Empresa.register();
